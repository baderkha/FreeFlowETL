import { useEffect, useMemo, useRef, useState } from 'react';
import { Fragment } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { sourceTypes, targetTypes } from '../data/connectionOptions';

const steps = ['Source', 'Connection', 'Tables', 'Target', 'Review'];

const cardPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 1px rgba(255, 212, 71, 0.24); }
  50% { box-shadow: 0 0 0 1px rgba(255, 212, 71, 0.5), 0 0 22px rgba(255, 212, 71, 0.16); }
`;

const riseIn = keyframes`
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const targetIconMap = {
  snowflake: HubRoundedIcon,
  csv: DescriptionRoundedIcon,
  s3: CloudQueueRoundedIcon
};

const sourceIconUrl = (slug, muted = false) => {
  const color = muted ? '7e7895' : 'ffe9a6';
  return `https://cdn.simpleicons.org/${slug}/${color}`;
};

const initialSource = sourceTypes.find((item) => item.supported)?.value || sourceTypes[0]?.value || '';

const initialForm = {
  sourceType: initialSource,
  sourceHost: '',
  sourcePort: initialSource === 'postgres' ? '5432' : '3306',
  sourceUser: '',
  sourcePassword: '',
  sourceDatabase: '',
  useGtid: 'false',
  engine: 'mariadb/mysql',
  filterDbs: '',
  fastsyncParallelism: '4',
  sourceSchemaName: 'my_db',
  targetSchemaName: 'repl_my_db',
  targetId: 'snowflake',
  batchSizeRows: '20000',
  streamBufferSize: '0',
  targetType: targetTypes[0].value,
  targetName: '',
  selectedTables: ['table_one'],
  tableConfigs: {
    table_one: {
      replicationMethod: 'LOG_BASED',
      cursorColumn: ''
    }
  }
};

function ConnectionsPage() {
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [sourceSearch, setSourceSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [saved, setSaved] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [maxContainerHeight, setMaxContainerHeight] = useState(760);
  const [guidedSections, setGuidedSections] = useState({
    credentials: true,
    advanced: false
  });
  const [expandedTableConfigs, setExpandedTableConfigs] = useState({ table_one: true });
  const [tableSortBy, setTableSortBy] = useState('tableName');
  const [tableSortOrder, setTableSortOrder] = useState('asc');
  const panelRefs = useRef([]);

  const tableOptions = ['table_one', 'table_two', 'table_three', 'table_four', 'events', 'users', 'orders'];
  const tableColumns = {
    table_one: ['id', 'updated_at', 'created_at', 'status'],
    table_two: ['id', 'event_time', 'updated_at'],
    table_three: ['id', 'processed_at', 'load_ts'],
    table_four: ['id', 'synced_at', 'revision'],
    events: ['id', 'occurred_at', 'ingested_at'],
    users: ['id', 'updated_at', 'last_seen_at'],
    orders: ['id', 'ordered_at', 'updated_at']
  };
  const stepIcons = [
    <HubRoundedIcon fontSize="small" key="source" />,
    <DnsRoundedIcon fontSize="small" key="connection" />,
    <TableRowsRoundedIcon fontSize="small" key="tables" />,
    <RouteRoundedIcon fontSize="small" key="target" />,
    <FactCheckRoundedIcon fontSize="small" key="review" />
  ];

  const updateField = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const filteredSources = useMemo(() => {
    const term = sourceSearch.trim().toLowerCase();
    if (!term) return sourceTypes;
    return sourceTypes.filter((item) => item.label.toLowerCase().includes(term));
  }, [sourceSearch]);

  const filteredTables = useMemo(() => {
    const term = tableSearch.trim().toLowerCase();
    if (!term) return tableOptions;
    return tableOptions.filter((item) => item.toLowerCase().includes(term));
  }, [tableSearch]);

  const sortedTables = useMemo(() => {
    const rows = filteredTables.map((tableName) => {
      const cfg = form.tableConfigs[tableName] || { replicationMethod: 'LOG_BASED', cursorColumn: '' };
      return {
        tableName,
        selected: form.selectedTables.includes(tableName),
        method: cfg.replicationMethod || 'LOG_BASED',
        cursor: cfg.cursorColumn || ''
      };
    });

    rows.sort((a, b) => {
      const dir = tableSortOrder === 'asc' ? 1 : -1;
      if (tableSortBy === 'selected') {
        return (Number(a.selected) - Number(b.selected)) * dir;
      }
      if (tableSortBy === 'method') {
        return a.method.localeCompare(b.method) * dir;
      }
      return a.tableName.localeCompare(b.tableName) * dir;
    });
    return rows;
  }, [filteredTables, form.selectedTables, form.tableConfigs, tableSortBy, tableSortOrder]);

  const sourceYamlPreview = useMemo(() => {
    const tableList = form.selectedTables.length ? form.selectedTables : ['table_one'];
    const tableLines = tableList.flatMap((tableName) => {
      const cfg = form.tableConfigs[tableName] || { replicationMethod: 'LOG_BASED', cursorColumn: '' };
      return [
        `      - table_name: "${tableName}"`,
        `        replication_method: "${cfg.replicationMethod}"`,
        cfg.replicationMethod === 'INCREMENTAL'
          ? `        replication_key: "${cfg.cursorColumn || 'updated_at'}"`
          : '        # replication_key not required'
      ];
    });

    return [
      '---',
      `type: "tap-${form.sourceType}"`,
      'db_conn:',
      `  host: "${form.sourceHost || 'source-host'}"`,
      `  port: ${form.sourcePort || (form.sourceType === 'postgres' ? 5432 : 3306)}`,
      `  user: "${form.sourceUser || '<USER>'}"`,
      `  password: "${form.sourcePassword || '<PASSWORD>'}"`,
      `  dbname: "${form.sourceDatabase || 'source_db'}"`,
      `  use_gtid: ${form.useGtid}`,
      `  engine: "${form.engine || 'mariadb/mysql'}"`,
      form.filterDbs ? `  filter_dbs: "${form.filterDbs}"` : '  #filter_dbs: "schema1,schema2"',
      `  fastsync_parallelism: ${form.fastsyncParallelism || 4}`,
      `target: "${form.targetId || 'snowflake'}"`,
      `batch_size_rows: ${form.batchSizeRows || 20000}`,
      `stream_buffer_size: ${form.streamBufferSize || 0}`,
      'schemas:',
      `  - source_schema: "${form.sourceSchemaName || 'my_db'}"`,
      `    target_schema: "${form.targetSchemaName || 'repl_my_db'}"`,
      '    tables:',
      ...tableLines
    ].join('\n');
  }, [form]);

  const targetYamlPreview = useMemo(
    () =>
      [
        '---',
        `id: "${form.targetName || 'target_default'}"`,
        `name: "${form.targetName || 'Target Connection'}"`,
        `type: "${form.targetType === 'csv' ? 'target-s3-csv' : `target-${form.targetType}`}"`,
        'db_conn:',
        form.targetType === 'snowflake'
          ? '  account: "<snowflake_account>"\\n  dbname: "<warehouse_db>"\\n  warehouse: "<warehouse_name>"'
          : form.targetType === 'csv'
            ? '  s3_bucket: "<bucket_name>"\\n  s3_key_prefix: "exports/"'
            : '  bucket: "<bucket_name>"\\n  prefix: "raw/"'
      ].join('\n'),
    [form.targetName, form.targetType]
  );

  const selectedSource = sourceTypes.find((item) => item.value === form.sourceType);
  const selectedSourceSupported = Boolean(selectedSource?.supported);
  const tableConfigsForSelection = useMemo(
    () =>
      form.selectedTables.map((tableName) => ({
        tableName,
        ...(form.tableConfigs[tableName] || { replicationMethod: 'LOG_BASED', cursorColumn: '' })
      })),
    [form.selectedTables, form.tableConfigs]
  );
  const tablesAreValid = useMemo(
    () =>
      tableConfigsForSelection.every(
        (cfg) => cfg.replicationMethod !== 'INCREMENTAL' || Boolean(cfg.cursorColumn?.trim())
      ),
    [tableConfigsForSelection]
  );

  const canContinue =
    (activeStep === 0 && selectedSourceSupported) ||
    (activeStep === 1 &&
      Boolean(form.sourceHost.trim()) &&
      Boolean(form.sourcePort.trim()) &&
      Boolean(form.sourceUser.trim()) &&
      Boolean(form.sourcePassword.trim()) &&
      Boolean(form.sourceDatabase.trim())) ||
    (activeStep === 2 && form.selectedTables.length > 0 && tablesAreValid) ||
    (activeStep === 3 && Boolean(form.targetName.trim())) ||
    activeStep === 4;

  const onNext = () => {
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
  };

  const onBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const onEnroll = () => {
    setSaved(form);
    setActiveStep(5);
  };

  const onStartOver = () => {
    setForm(initialForm);
    setSourceSearch('');
    setTableSearch('');
    setSaved(null);
    setActiveStep(0);
    setGuidedSections({ credentials: true, advanced: false });
  };

  const toggleGuidedSection = (sectionKey) => {
    setGuidedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleTableSelection = (tableName) => {
    setForm((prev) => {
      const exists = prev.selectedTables.includes(tableName);
      return {
        ...prev,
        selectedTables: exists
          ? prev.selectedTables.filter((item) => item !== tableName)
          : [...prev.selectedTables, tableName],
        tableConfigs: exists
          ? prev.tableConfigs
          : {
              ...prev.tableConfigs,
              [tableName]: prev.tableConfigs[tableName] || {
                replicationMethod: 'LOG_BASED',
                cursorColumn: ''
              }
            }
      };
    });
    setExpandedTableConfigs((prev) => ({ ...prev, [tableName]: true }));
  };

  const toggleSelectAllVisibleTables = () => {
    setForm((prev) => {
      const visibleTables = filteredTables;
      const allVisibleSelected = visibleTables.length > 0 && visibleTables.every((tableName) => prev.selectedTables.includes(tableName));

      if (allVisibleSelected) {
        return {
          ...prev,
          selectedTables: prev.selectedTables.filter((tableName) => !visibleTables.includes(tableName))
        };
      }

      const nextSelected = new Set(prev.selectedTables);
      const nextConfigs = { ...prev.tableConfigs };
      visibleTables.forEach((tableName) => {
        nextSelected.add(tableName);
        if (!nextConfigs[tableName]) {
          nextConfigs[tableName] = { replicationMethod: 'LOG_BASED', cursorColumn: '' };
        }
      });

      return {
        ...prev,
        selectedTables: Array.from(nextSelected),
        tableConfigs: nextConfigs
      };
    });

    setExpandedTableConfigs((prev) => {
      const next = { ...prev };
      filteredTables.forEach((tableName) => {
        next[tableName] = true;
      });
      return next;
    });
  };

  const updateTableConfig = (tableName, key, value) => {
    setForm((prev) => ({
      ...prev,
      tableConfigs: {
        ...prev.tableConfigs,
        [tableName]: {
          ...(prev.tableConfigs[tableName] || {
            replicationMethod: 'LOG_BASED',
            cursorColumn: ''
          }),
          [key]: value
        }
      }
    }));
  };

  const toggleTableExpansion = (tableName) => {
    setExpandedTableConfigs((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  const toggleTableSort = (columnKey) => {
    if (tableSortBy === columnKey) {
      setTableSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setTableSortBy(columnKey);
      setTableSortOrder('asc');
    }
  };

  useEffect(() => {
    const node = panelRefs.current[activeStep];
    if (!node) return;

    const updateHeight = () => {
      const nextHeight = node.scrollHeight + 8;
      setContainerHeight(nextHeight);
    };

    updateHeight();
    const rafId = requestAnimationFrame(updateHeight);

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [activeStep, form, guidedSections, tableSearch]);

  useEffect(() => {
    const updateMaxHeight = () => {
      const next = Math.max(360, window.innerHeight - 260);
      setMaxContainerHeight(Math.min(820, next));
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  const effectiveContainerHeight = containerHeight ? Math.min(containerHeight, maxContainerHeight) : 'auto';

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" spacing={1}>
        <Typography variant="h4">Connections Setup</Typography>
      </Stack>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Stepper activeStep={Math.min(activeStep, steps.length - 1)} alternativeLabel>
          {steps.map((step, index) => {
            const isCompleted = activeStep > index;
            const isCurrent = activeStep === index || (activeStep >= steps.length && index === steps.length - 1);

            return (
              <Step key={step} completed={isCompleted}>
                <StepLabel
                  icon={
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted || isCurrent ? '#2b2200' : 'primary.main',
                        bgcolor: isCurrent
                          ? 'rgba(255, 212, 71, 0.95)'
                          : isCompleted
                            ? 'rgba(255, 212, 71, 0.7)'
                            : 'rgba(255, 212, 71, 0.1)',
                        border: isCompleted || isCurrent ? '1px solid rgba(255, 212, 71, 0.9)' : '1px solid rgba(255, 212, 71, 0.35)',
                        boxShadow: isCurrent
                          ? '0 0 0 1px rgba(255,212,71,0.75), 0 0 22px rgba(255,212,71,0.8)'
                          : isCompleted
                            ? '0 0 0 1px rgba(255,212,71,0.55), 0 0 14px rgba(255,212,71,0.45)'
                            : '0 0 8px rgba(255,212,71,0.2)',
                        transition: 'all 180ms ease'
                      }}
                    >
                      {stepIcons[index]}
                    </Box>
                  }
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: isCurrent || isCompleted ? 'primary.main' : 'text.secondary',
                      fontWeight: isCurrent ? 700 : 500
                    }
                  }}
                >
                  {step}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box
          sx={{
            mt: 3,
            overflow: 'hidden',
            borderRadius: 2,
            height: effectiveContainerHeight,
            transition: 'height 320ms cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              transform: `translateX(-${activeStep * 100}%)`,
              transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            <Box
              sx={{ width: '100%', flexShrink: 0, p: 0.5, maxHeight: effectiveContainerHeight, overflowY: 'auto' }}
              ref={(el) => { panelRefs.current[0] = el; }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Select Source Tap</Typography>
                <TextField
                  fullWidth
                  placeholder="Search sources..."
                  value={sourceSearch}
                  onChange={(event) => setSourceSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ManageSearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                  {filteredSources.map((item) => {
                    const selected = form.sourceType === item.value;
                    const disabled = !item.supported;

                    return (
                      <Paper
                        key={item.value}
                        variant="outlined"
                        onClick={disabled ? undefined : () => setForm((prev) => ({ ...prev, sourceType: item.value }))}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          borderColor: selected ? 'primary.main' : 'divider',
                          backgroundColor: selected ? 'rgba(255, 212, 71, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                          opacity: disabled ? 0.4 : 1,
                          filter: disabled ? 'grayscale(0.9)' : 'none',
                          transform: selected ? 'translateY(-2px)' : 'none',
                          transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease',
                          animation: selected ? `${cardPulse} 2.2s ease-in-out infinite` : `${riseIn} 260ms ease`,
                          '&:hover': disabled
                            ? undefined
                            : {
                                transform: selected ? 'translateY(-2px)' : 'translateY(-1px)'
                              }
                        }}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box
                              component="img"
                              src={sourceIconUrl(item.iconSlug, disabled)}
                              alt={item.label}
                              sx={{
                                width: 20,
                                height: 20,
                                opacity: disabled ? 0.6 : 1,
                                filter: selected ? 'drop-shadow(0 0 5px rgba(255, 212, 71, 0.32))' : 'none'
                              }}
                            />
                            <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                          </Stack>
                          {!item.supported && <Chip size="small" label="Coming Soon" variant="outlined" />}
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{ width: '100%', flexShrink: 0, p: 0.5, maxHeight: effectiveContainerHeight, overflowY: 'auto' }}
              ref={(el) => { panelRefs.current[1] = el; }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Connection Details</Typography>
                <Alert severity="info">Selected source: {selectedSource?.label || form.sourceType}</Alert>

                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha('#ffd447', 0.2)}`,
                    background: alpha('#130f2b', 0.56),
                    p: 1.5
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleGuidedSection('credentials')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha('#ffd447', 0.2)
                        }}
                      >
                        <KeyRoundedIcon fontSize="small" />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Source Credentials
                      </Typography>
                    </Stack>
                    <ExpandMoreRoundedIcon
                      sx={{
                        color: 'primary.main',
                        transform: guidedSections.credentials ? 'rotate(180deg)' : 'none',
                        transition: 'transform 180ms ease'
                      }}
                    />
                  </Stack>
                  <Collapse in={guidedSections.credentials} timeout={180} unmountOnExit>
                    <Stack spacing={1.5} sx={{ pt: 1.25 }}>
                      <TextField fullWidth required label="Host" value={form.sourceHost} onChange={updateField('sourceHost')} />
                      <TextField fullWidth required label="Port" value={form.sourcePort} onChange={updateField('sourcePort')} />
                      <TextField fullWidth required label="User" value={form.sourceUser} onChange={updateField('sourceUser')} />
                      <TextField fullWidth required type="password" label="Password" value={form.sourcePassword} onChange={updateField('sourcePassword')} />
                      <TextField fullWidth required label="Database" value={form.sourceDatabase} onChange={updateField('sourceDatabase')} />
                    </Stack>
                  </Collapse>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha('#ffd447', 0.2)}`,
                    background: alpha('#130f2b', 0.42),
                    p: 1.5
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleGuidedSection('advanced')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha('#2ce6ff', 0.18)
                        }}
                      >
                        <TuneRoundedIcon fontSize="small" />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Advanced
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="small" label="Optional" variant="outlined" />
                      <ExpandMoreRoundedIcon
                        sx={{
                          color: 'primary.main',
                          transform: guidedSections.advanced ? 'rotate(180deg)' : 'none',
                          transition: 'transform 180ms ease'
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Collapse in={guidedSections.advanced} timeout={180} unmountOnExit>
                    <Stack spacing={1.5} sx={{ pt: 1.25 }}>
                      <TextField fullWidth label="Filter DBs (optional)" value={form.filterDbs} onChange={updateField('filterDbs')} />
                      <TextField select fullWidth label="use_gtid" value={form.useGtid} onChange={updateField('useGtid')}>
                        <MenuItem value="true">true</MenuItem>
                        <MenuItem value="false">false</MenuItem>
                      </TextField>
                      <TextField fullWidth label="DB Type" value="mariadb/mysql" disabled />
                      <TextField fullWidth label="fastsync_parallelism" value={form.fastsyncParallelism} onChange={updateField('fastsyncParallelism')} />
                      <TextField fullWidth label="target" value={form.targetId} onChange={updateField('targetId')} />
                      <TextField fullWidth label="batch_size_rows" value={form.batchSizeRows} onChange={updateField('batchSizeRows')} />
                      <TextField fullWidth label="stream_buffer_size" value={form.streamBufferSize} onChange={updateField('streamBufferSize')} />
                      <TextField fullWidth label="source_schema" value={form.sourceSchemaName} onChange={updateField('sourceSchemaName')} />
                      <TextField fullWidth label="target_schema" value={form.targetSchemaName} onChange={updateField('targetSchemaName')} />
                    </Stack>
                  </Collapse>
                </Paper>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <CheckCircleOutlineRoundedIcon fontSize="small" />
                  <Typography variant="caption">
                    Keep only credentials open for a clean setup. Expand Advanced only when needed.
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{ width: '100%', flexShrink: 0, p: 0.5, maxHeight: effectiveContainerHeight, overflowY: 'auto' }}
              ref={(el) => { panelRefs.current[2] = el; }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Choose Tables</Typography>
                <TextField
                  fullWidth
                  placeholder="Search tables..."
                  value={tableSearch}
                  onChange={(event) => setTableSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ManageSearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <TableContainer>
                    <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" sx={{ width: 64 }}>
                            <Checkbox
                              checked={
                                filteredTables.length > 0 &&
                                filteredTables.every((tableName) => form.selectedTables.includes(tableName))
                              }
                              indeterminate={
                                filteredTables.some((tableName) => form.selectedTables.includes(tableName)) &&
                                !filteredTables.every((tableName) => form.selectedTables.includes(tableName))
                              }
                              onChange={toggleSelectAllVisibleTables}
                              inputProps={{ 'aria-label': 'select all visible tables' }}
                            />
                          </TableCell>
                          <TableCell sx={{ width: '30%' }}>
                            <TableSortLabel
                              active={tableSortBy === 'tableName'}
                              direction={tableSortBy === 'tableName' ? tableSortOrder : 'asc'}
                              onClick={() => toggleTableSort('tableName')}
                            >
                              Table
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ width: '23%' }}>
                            <TableSortLabel
                              active={tableSortBy === 'method'}
                              direction={tableSortBy === 'method' ? tableSortOrder : 'asc'}
                              onClick={() => toggleTableSort('method')}
                            >
                              Method
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ width: '23%' }}>Cursor</TableCell>
                          <TableCell align="center" sx={{ width: 130 }}>
                            <TableSortLabel
                              active={tableSortBy === 'selected'}
                              direction={tableSortBy === 'selected' ? tableSortOrder : 'asc'}
                              onClick={() => toggleTableSort('selected')}
                            >
                              Status
                            </TableSortLabel>
                          </TableCell>
                          <TableCell align="center" sx={{ width: 90 }}>Columns</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedTables.map((row) => {
                          const tableName = row.tableName;
                          const cfg = form.tableConfigs[tableName] || { replicationMethod: 'LOG_BASED', cursorColumn: '' };
                          const isSelected = form.selectedTables.includes(tableName);
                          const isExpanded = Boolean(expandedTableConfigs[tableName]);

                          return (
                            <Fragment key={tableName}>
                              <TableRow key={tableName} hover>
                                <TableCell padding="checkbox" sx={{ width: 64 }}>
                                  <Checkbox checked={isSelected} onChange={() => toggleTableSelection(tableName)} />
                                </TableCell>
                                <TableCell sx={{ width: '30%' }}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <TableRowsRoundedIcon fontSize="small" />
                                    <Typography noWrap>{tableName}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ width: '23%' }}>
                                  <TextField
                                    select
                                    size="small"
                                    fullWidth
                                    value={cfg.replicationMethod || 'LOG_BASED'}
                                    onChange={(event) => updateTableConfig(tableName, 'replicationMethod', event.target.value)}
                                    disabled={!isSelected}
                                  >
                                    <MenuItem value="LOG_BASED">LOG_BASED</MenuItem>
                                    <MenuItem value="INCREMENTAL">INCREMENTAL</MenuItem>
                                    <MenuItem value="FULL_TABLE">FULL_TABLE</MenuItem>
                                  </TextField>
                                </TableCell>
                                <TableCell sx={{ width: '23%' }}>
                                  {cfg.replicationMethod === 'INCREMENTAL' ? (
                                    <TextField
                                      select
                                      size="small"
                                      fullWidth
                                      value={cfg.cursorColumn || ''}
                                      onChange={(event) => updateTableConfig(tableName, 'cursorColumn', event.target.value)}
                                      disabled={!isSelected}
                                    >
                                      {(tableColumns[tableName] || ['updated_at']).map((col) => (
                                        <MenuItem key={col} value={col}>
                                          {col}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">
                                      N/A
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell align="center" sx={{ width: 130 }}>
                                  <Chip
                                    size="small"
                                    label={isSelected ? 'Selected' : 'Not Selected'}
                                    color={isSelected ? 'primary' : 'default'}
                                    variant={isSelected ? 'filled' : 'outlined'}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ width: 90 }}>
                                  <IconButton size="small" onClick={() => toggleTableExpansion(tableName)}>
                                    <ExpandMoreRoundedIcon
                                      sx={{
                                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 180ms ease'
                                      }}
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
                                  <Collapse in={isExpanded} timeout={180} unmountOnExit>
                                    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.5, my: 1 }}>
                                      <Stack spacing={0.75}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                          Available Columns
                                        </Typography>
                                        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                                          {(tableColumns[tableName] || ['updated_at']).map((col) => (
                                            <Chip key={col} size="small" label={col} />
                                          ))}
                                        </Stack>
                                      </Stack>
                                    </Paper>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                <Alert severity={form.selectedTables.length ? 'success' : 'warning'}>
                  {form.selectedTables.length === 0
                    ? 'Select at least one table to continue.'
                    : !tablesAreValid
                      ? 'Fill cursor column for every INCREMENTAL table.'
                      : `${form.selectedTables.length} table(s) selected and configured.`}
                </Alert>
              </Stack>
            </Box>

            <Box
              sx={{ width: '100%', flexShrink: 0, p: 0.5, maxHeight: effectiveContainerHeight, overflowY: 'auto' }}
              ref={(el) => { panelRefs.current[3] = el; }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Select Target</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                  {targetTypes.map((item) => {
                    const Icon = targetIconMap[item.value] || HubRoundedIcon;
                    const selected = form.targetType === item.value;
                    return (
                      <Paper
                        key={item.value}
                        variant="outlined"
                        onClick={() => setForm((prev) => ({ ...prev, targetType: item.value }))}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          borderColor: selected ? 'secondary.main' : 'divider',
                          backgroundColor: selected ? 'rgba(255, 122, 69, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                          transform: selected ? 'translateY(-2px)' : 'none',
                          transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease',
                          '&:hover': { transform: selected ? 'translateY(-2px)' : 'translateY(-1px)' }
                        }}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Icon color={selected ? 'secondary' : 'action'} />
                          <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
                <TextField fullWidth label="Target Name / Bucket / Stage" value={form.targetName} onChange={updateField('targetName')} />
              </Stack>
            </Box>

            <Box
              sx={{ width: '100%', flexShrink: 0, p: 0.5, maxHeight: effectiveContainerHeight, overflowY: 'auto' }}
              ref={(el) => { panelRefs.current[4] = el; }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">Review & Enroll</Typography>
                <Alert icon={<CheckCircleRoundedIcon fontSize="inherit" />} severity="info">
                  Ready to enroll: tap-{form.sourceType} → {form.targetType}
                </Alert>
                <Typography variant="subtitle2" color="text.secondary">Source YAML</Typography>
                <Box component="pre" sx={{ m: 0, p: 2, borderRadius: 1.5, backgroundColor: '#090817', color: '#ffe9a6', overflowX: 'auto', fontFamily: 'monospace', fontSize: 13 }}>{sourceYamlPreview}</Box>
                <Typography variant="subtitle2" color="text.secondary">Target YAML</Typography>
                <Box component="pre" sx={{ m: 0, p: 2, borderRadius: 1.5, backgroundColor: '#090817', color: '#ffe9a6', overflowX: 'auto', fontFamily: 'monospace', fontSize: 13 }}>{targetYamlPreview}</Box>
              </Stack>
            </Box>

            <Box
              sx={{ width: '100%', flexShrink: 0, p: 0.5, maxHeight: effectiveContainerHeight, overflowY: 'auto' }}
              ref={(el) => { panelRefs.current[5] = el; }}
            >
              <Stack alignItems="center" spacing={2} sx={{ pt: 3 }}>
                <CheckCircleRoundedIcon color="success" sx={{ fontSize: 56 }} />
                <Typography variant="h5">Connection Enrolled</Typography>
                <Typography color="text.secondary" textAlign="center">
                  tap-{saved?.sourceType || form.sourceType} is configured to load into {saved?.targetType || form.targetType}.
                </Typography>
                <Button variant="contained" onClick={onStartOver} startIcon={<SaveRoundedIcon />}>Create Another Connection</Button>
              </Stack>
            </Box>
          </Box>
        </Box>

        {activeStep < 5 && (
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2.5 }}>
            <Button onClick={onBack} disabled={activeStep === 0} startIcon={<ChevronLeftRoundedIcon />}>Back</Button>
            {activeStep < 4 ? (
              <Button variant="contained" onClick={onNext} disabled={!canContinue} endIcon={<ChevronRightRoundedIcon />} sx={{ transition: 'transform 180ms ease', '&:hover': { transform: 'translateX(2px)' } }}>
                Next
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={onEnroll} startIcon={<SaveRoundedIcon />} sx={{ transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-1px)' } }}>
                Enroll Connection
              </Button>
            )}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

export default ConnectionsPage;
