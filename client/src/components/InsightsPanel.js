import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Divider,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';
import ImageIcon       from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderZipIcon   from '@mui/icons-material/FolderZip';
import TimerIcon       from '@mui/icons-material/Timer';
import { BRAND }       from '../theme/theme';

// Logo-matched colour palette for charts
const CHART_COLORS = [
  BRAND.blue, BRAND.green, BRAND.teal, BRAND.greenLight,
  BRAND.tealLight, BRAND.blueLight, '#f59e0b', '#e53935',
];

const StatCard = ({ icon, label, value, sub, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: '20px !important' }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: 2, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={800} color={BRAND.navy}>{value}</Typography>
        <Typography variant="body2" fontWeight={500} color="text.primary">{label}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </Box>
    </CardContent>
  </Card>
);

// Custom tooltip for bar chart
const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{
      bgcolor: '#fff', border: `1px solid ${BRAND.border}`, borderRadius: 2,
      px: 2, py: 1, boxShadow: '0 4px 16px rgba(13,46,63,0.12)',
    }}>
      <Typography variant="caption" fontWeight={700} color={BRAND.navy}>{payload[0].payload.name}</Typography>
      <Typography variant="body2" color={BRAND.blue}>{payload[0].value} image{payload[0].value !== 1 ? 's' : ''}</Typography>
    </Box>
  );
};

const InsightsPanel = ({ insights }) => {
  if (!insights) return null;
  const {
    totalUploads = 0, totalImages = 0,
    textImages = 0, noTextImages = 0,
    avgProcessingTime = 0, categoryDistribution = [],
  } = insights;

  const pieData = [
    { name: 'Has Text',  value: textImages   },
    { name: 'No Text',   value: noTextImages },
  ].filter((d) => d.value > 0);

  const barData = categoryDistribution.slice(0, 10);
  const isEmpty = pieData.length === 0 && barData.length === 0;

  return (
    <Box>
      {/* Stat row — full width 4 columns */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<FolderZipIcon />} label="Total Uploads" value={totalUploads} color={BRAND.blue} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<ImageIcon />} label="Images Processed" value={totalImages}
            sub={totalUploads > 0 ? `Avg ${Math.round(totalImages / totalUploads)}/upload` : ''} color={BRAND.green} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<TextSnippetIcon />} label="Images with Text" value={textImages}
            sub={totalImages > 0 ? `${Math.round((textImages / totalImages) * 100)}% of total` : ''} color={BRAND.teal} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<TimerIcon />} label="Avg Processing" value={avgProcessingTime ? `${avgProcessingTime}ms` : '—'}
            sub="per image (OCR)" color={BRAND.greenLight} />
        </Grid>
      </Grid>

      {isEmpty ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary" variant="body2">
              No analysis data yet. Upload a ZIP and run Analyze or Classify to see charts here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {/* Pie chart — text detection */}
          {pieData.length > 0 && (
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700} color={BRAND.navy} gutterBottom>
                    Text Detection Breakdown
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData} cx="50%" cy="50%"
                        innerRadius={60} outerRadius={85}
                        paddingAngle={4} dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? BRAND.blue : BRAND.border} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} images`, '']} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Bar chart — categories (takes remaining width) */}
          {barData.length > 0 && (
            <Grid item xs={12} md={pieData.length > 0 ? 8 : 12}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={700} color={BRAND.navy} gutterBottom>
                    Top Detected Categories
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} vertical={false} />
                      <XAxis
                        dataKey="name" tick={{ fontSize: 11, fill: BRAND.navy }}
                        tickFormatter={(v) => v.length > 12 ? v.slice(0, 12) + '…' : v}
                      />
                      <YAxis tick={{ fontSize: 11, fill: BRAND.navy }} allowDecimals={false} />
                      <Tooltip content={<BarTooltip />} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                        {barData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Category chips row — full width */}
          {categoryDistribution.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ py: '12px !important' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.6, mr: 1 }}>
                    Most Common Objects:
                  </Typography>
                  <Box component="span" sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {categoryDistribution.slice(0, 12).map((cat, i) => (
                      <Chip
                        key={cat.name}
                        label={`${cat.name}  ${cat.count}`}
                        size="small"
                        sx={{
                          bgcolor: `${CHART_COLORS[i % CHART_COLORS.length]}18`,
                          color:   CHART_COLORS[i % CHART_COLORS.length],
                          fontWeight: 600, border: 'none',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default InsightsPanel;