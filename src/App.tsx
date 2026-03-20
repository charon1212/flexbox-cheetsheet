import { useMemo, useState } from 'react';
import { Box, FormControlLabel, Paper, Radio, RadioGroup, Slider, Stack, Switch, Typography } from '@mui/material';

/**
 * 左側のFlexStateコントロールパネル
 */
type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';

type FlexState = {
  flexDirection: FlexDirection;
  flexWrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  gap: number;
  itemCount: number;
  variedHeight: boolean;
};

const useRadioBlock = ({ title, options }: { title: string; options: string[] }) => {
  const [value, setValue] = useState(options[0] || '');
  const ui = (
    <Box>
      <Typography fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <RadioGroup row value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((opt) => (
          <FormControlLabel key={opt} value={opt} control={<Radio size='small' />} label={opt} />
        ))}
      </RadioGroup>
    </Box>
  );

  return [value, ui] as const;
};

const useSliderBlock = ({ title, min, max, step, initial }: { title: string; min: number; max: number; step: number; initial?: number }) => {
  const [value, setValue] = useState(initial ?? min);
  const ui = (
    <Box>
      <Typography gutterBottom>
        {title}: {value}
      </Typography>
      <Slider value={value} min={min} max={max} step={step} marks onChange={(_, v) => setValue(v as number)} />
    </Box>
  );
  return [value, ui] as const;
};

const useFlexStateControl = () => {
  const [flexDirection, uiFlexDirection] = useRadioBlock({ title: 'flex-direction (並ぶ向き)', options: ['row', 'row-reverse', 'column', 'column-reverse'] });
  const [flexWrap, uiFlexWrap] = useRadioBlock({ title: 'flex-wrap (要素の折り返し)', options: ['nowrap', 'wrap', 'wrap-reverse'] });
  const [justifyContent, uiJustifyContent] = useRadioBlock({ title: 'justify-content', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] });
  const [alignItems, uiAlignItems] = useRadioBlock({ title: 'align-items', options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] });
  const [gap, uiGap] = useSliderBlock({ title: 'gap', min: 0, max: 10, step: 1, initial: 2 });
  const [itemCount, uiItemCount] = useSliderBlock({ title: 'item count', min: 1, max: 20, step: 1, initial: 5 });
  const [variedHeight, setVariedHeight] = useState(false);

  const ui = (
    <Paper sx={{ width: 700, p: 3, borderRadius: 3 }}>
      <Typography variant='h6' fontWeight={700} sx={{ mb: 2 }}>
        Controls
      </Typography>

      <Stack spacing={3}>
        {uiFlexDirection}
        {uiFlexWrap}
        {uiJustifyContent}
        {uiAlignItems}
        {uiGap}
        {uiItemCount}
        <FormControlLabel control={<Switch checked={variedHeight} onChange={(e) => setVariedHeight(e.target.checked)} />} label='高さバラバラ' />
      </Stack>
    </Paper>
  );

  return [{ flexDirection, flexWrap, justifyContent, alignItems, gap, itemCount, variedHeight } as FlexState, ui] as const;
};

const itemHeights = [64, 92, 52, 110, 76, 88, 60, 98];
const Preview = ({ flexState }: { flexState: FlexState }) => {
  const items = Array.from({ length: flexState.itemCount }, (_, i) => ({
    id: i + 1,
    height: flexState.variedHeight ? itemHeights[i % itemHeights.length] : 72,
  }));
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography fontWeight={700} sx={{ mb: 2 }}>
        Preview
      </Typography>

      <Box
        sx={{
          height: 400,
          border: '2px dashed #ccc',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: flexState.flexDirection,
            flexWrap: flexState.flexWrap,
            justifyContent: flexState.justifyContent,
            alignItems: flexState.alignItems,
            gap: flexState.gap,
            height: '100%',
          }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: 80,
                height: item.height,
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
              }}
            >
              {item.id}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

const CssCode = ({ flexState }: { flexState: FlexState }) => {
  const cssCode = useMemo(() => {
    return ['display: flex;', `flex-direction: ${flexState.flexDirection};`, `flex-wrap: ${flexState.flexWrap};`, `justify-content: ${flexState.justifyContent};`, `align-items: ${flexState.alignItems};`, `gap: ${flexState.gap * 8}px;`].join('\n');
  }, [flexState]);

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography fontWeight={700} sx={{ mb: 2 }}>
        CSS
      </Typography>

      <Box
        component='pre'
        sx={{
          m: 0,
          p: 2,
          bgcolor: '#111',
          color: '#eee',
          borderRadius: 2,
        }}
      >
        {cssCode}
      </Box>
    </Paper>
  );
};

export const App = () => {
  const [flexState, uiFlexStateControl] = useFlexStateControl();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f8fa', p: 3 }}>
      <Typography variant='h4' fontWeight={700} gutterBottom>
        Flexbox CheetSheet
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          {/* LEFT */}
          {uiFlexStateControl}
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* RIGHT */}
          <Stack spacing={3} sx={{ flex: 1 }}>
            <Preview flexState={flexState} />
            <CssCode flexState={flexState} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
