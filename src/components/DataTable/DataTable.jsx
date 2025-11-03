// components/DataTable/DataTable.jsx
'use client';

import {
  Card,
  Text,
  Group,
  Title,
  Box,
  Badge,
  Button,
  Table,
  Avatar,
  ActionIcon,
  TextInput,
  Select,
  Pagination,
  Loader,
  Center,
  Stack,
  Flex,
  Tooltip,
  Paper,
  Grid,
  UnstyledButton,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconFilter,
  IconRefresh,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconX,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState, useEffect, useCallback } from 'react';

export default function DataTable({
  // Required props
  title,
  apiEndpoint,
  fetchFunction,
  columns,
  actions,
  
  // Optional props with defaults
  exportEnabled = true,
  addEnabled = true,
  filters = [],
  defaultSort = { field: 'createdAt', order: 'desc' },
  defaultLimit = 50,
  
  // Callbacks
  onAdd,
  onEdit,
  onView,
  onDelete,
  onExport,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filter states
  const [filterValues, setFilterValues] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Async filter data states
  const [asyncFilterData, setAsyncFilterData] = useState({});
  const [loadingFilters, setLoadingFilters] = useState({});
  
  // Sort states
  const [sortBy, setSortBy] = useState(defaultSort.field);
  const [sortOrder, setSortOrder] = useState(defaultSort.order);

  // Initialize filter values
  useEffect(() => {
    const initialFilters = {};
    const initialAsyncData = {};
    const initialLoading = {};
    
    filters.forEach(filter => {
      initialFilters[filter.key] = '';
      initialAsyncData[filter.key] = [];
      initialLoading[filter.key] = false;
    });
    
    setFilterValues(initialFilters);
    setAsyncFilterData(initialAsyncData);
    setLoadingFilters(initialLoading);
  }, [filters]);

  // Load initial data for async filters
  useEffect(() => {
    filters.forEach(async (filter) => {
      if (filter.filterFunction && filter.loadOnMount !== false) {
        loadAsyncFilterData(filter.key, filter.filterFunction);
      }
    });
  }, [filters]);

  const loadAsyncFilterData = async (filterKey, filterFunction, searchQuery = '') => {
    setLoadingFilters(prev => ({ ...prev, [filterKey]: true }));
    try {
      const data = await filterFunction(searchQuery);
      setAsyncFilterData(prev => ({ 
        ...prev, 
        [filterKey]: data 
      }));
    } catch (error) {
      console.error(`Failed to load filter data for ${filterKey}:`, error);
      setAsyncFilterData(prev => ({ 
        ...prev, 
        [filterKey]: [] 
      }));
    } finally {
      setLoadingFilters(prev => ({ ...prev, [filterKey]: false }));
    }
  };

  // Main fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Build params object
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      // Add filters
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value && value.trim()) {
          params[key] = value.trim();
        }
      });

      console.log('Fetching data with params:', params);

      const response = await fetchFunction(params);
      
      console.log('API Response:', response);

      // Handle response structure
      let items = [];
      let paginationData = null;

      if (response?.data) {
        if (Array.isArray(response.data)) {
          items = response.data;
          paginationData = response.pagination;
        } else if (response.data.items) {
          items = response.data.items;
          paginationData = response.data.pagination;
        } else if (response.data[Object.keys(response.data)[0]]) {
          // Handle { brands: [], pagination: {} } structure
          const dataKey = Object.keys(response.data).find(key => Array.isArray(response.data[key]));
          if (dataKey) {
            items = response.data[dataKey];
            paginationData = response.data.pagination;
          }
        }
      } else if (Array.isArray(response)) {
        items = response;
      }

      setData(items);
      
      // Set pagination
      if (paginationData) {
        setTotal(paginationData.total || 0);
        setTotalPages(paginationData.totalPages || 1);
      } else if (response?.total) {
        setTotal(response.total);
        setTotalPages(response.totalPages || 1);
      } else {
        setTotal(items.length);
        setTotalPages(1);
      }

    } catch (err) {
      console.error('Fetch data error:', err);
      notifications.show({
        title: 'Error',
        message: err?.response?.data?.message || err?.message || 'Failed to fetch data',
        color: 'red',
      });
      setData([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, filterValues, fetchFunction]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [page, limit, sortBy, sortOrder]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleReset = () => {
    const resetFilters = {};
    filters.forEach(filter => {
      resetFilters[filter.key] = '';
    });
    setFilterValues(resetFilters);
    setSortBy(defaultSort.field);
    setSortOrder(defaultSort.order);
    setPage(1);
    setLimit(defaultLimit);
    
    setTimeout(() => {
      fetchData();
    }, 50);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAsyncSearch = async (filterKey, filterFunction, searchQuery) => {
    await loadAsyncFilterData(filterKey, filterFunction, searchQuery);
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      notifications.show({
        title: 'No Data',
        message: 'No data to export',
        color: 'orange',
      });
      return;
    }

    if (onExport) {
      onExport(data);
      return;
    }

    // Default CSV export
    const headers = columns.map(col => col.header);
    const csvContent = [
      headers.join(','),
      ...data.map(item => 
        columns.map(col => {
          const value = typeof col.accessor === 'function' 
            ? col.accessor(item)
            : item[col.accessor];
          return `"${(value || '').toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: `Exported ${data.length} records to CSV`,
      color: 'green',
    });
  };

  const SortableHeader = ({ children, field, sortable = true }) => {
    if (!sortable) {
      return <Text fw={600} size="sm">{children}</Text>;
    }
    
    return (
      <UnstyledButton onClick={() => handleSort(field)}>
        <Group gap={4}>
          <Text fw={600} size="sm">{children}</Text>
          {sortBy === field ? (
            sortOrder === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
          ) : (
            <IconSelector size={14} opacity={0.5} />
          )}
        </Group>
      </UnstyledButton>
    );
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v && v.trim()).length;

  const renderFilterInput = (filter) => {
    const commonProps = {
      label: filter.label,
      placeholder: filter.placeholder || `Search by ${filter.label.toLowerCase()}...`,
      value: filterValues[filter.key] || '',
    };

    switch (filter.type) {
      case 'select':
        if (filter.filterFunction) {
          // Async select with search
          return (
            <Select
              {...commonProps}
              data={asyncFilterData[filter.key] || []}
              clearable
              searchable
              nothingFound={loadingFilters[filter.key] ? "Loading..." : "No options found"}
              onSearchChange={(query) => {
                if (filter.onSearchChange) {
                  filter.onSearchChange(query);
                }
                // Debounce the search
                setTimeout(() => {
                  handleAsyncSearch(filter.key, filter.filterFunction, query);
                }, 300);
              }}
              onChange={(value) => handleFilterChange(filter.key, value)}
            />
          );
        }
        return (
          <Select
            {...commonProps}
            data={filter.options}
            clearable
            onChange={(value) => handleFilterChange(filter.key, value)}
          />
        );
      case 'text':
      default:
        return (
          <TextInput
            {...commonProps}
            leftSection={filter.icon || <IconSearch size={16} />}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );
    }
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = typeof column.accessor === 'function' 
      ? column.accessor(item)
      : item[column.accessor];
    
    return <Text size="sm">{value || '-'}</Text>;
  };

  const rows = data.map((item, index) => (
    <Table.Tr key={item._id || item.id || index}>
      {columns.map((column) => (
        <Table.Td key={column.key || column.accessor}>
          {renderCellContent(item, column)}
        </Table.Td>
      ))}
      {actions && (
        <Table.Td>
          <Group gap="xs" justify="flex-end">
            {actions.view && (
              <Tooltip label="View Details">
                <ActionIcon 
                  variant="light" 
                  color="blue" 
                  size="sm"
                  onClick={() => onView?.(item)}
                >
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            {actions.edit && (
              <Tooltip label="Edit">
                <ActionIcon 
                  variant="light" 
                  color="yellow" 
                  size="sm"
                  onClick={() => onEdit?.(item)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            {actions.delete && (
              <Tooltip label="Delete">
                <ActionIcon 
                  variant="light" 
                  color="red" 
                  size="sm"
                  onClick={() => onDelete?.(item)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            )}
            {/* Custom actions */}
            {actions.custom?.map((action, idx) => (
              <Tooltip key={idx} label={action.tooltip}>
                <ActionIcon 
                  variant="light" 
                  color={action.color} 
                  size="sm"
                  onClick={() => action.onClick(item)}
                >
                  {action.icon}
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>{title}</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {total} total records
          </Text>
        </div>
        <Group>
          {exportEnabled && (
            <Button 
              leftSection={<IconDownload size={18} />} 
              variant="light"
              onClick={exportToCSV}
              disabled={data.length === 0}
            >
              Export CSV
            </Button>
          )}
          {addEnabled && (
            <Button 
              leftSection={<IconPlus size={18} />} 
              variant="filled"
              onClick={onAdd}
            >
              Add New
            </Button>
          )}
        </Group>
      </Group>

      {/* Search & Filter Card */}
      <Card padding="lg" radius="md" withBorder mb="md">
        <Group justify="space-between" mb="md">
          <Group>
            <IconSearch size={20} />
            <Text fw={500}>Search & Filter</Text>
            {activeFiltersCount > 0 && (
              <Badge size="sm" variant="filled">{activeFiltersCount} active</Badge>
            )}
          </Group>
          <Group>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconRefresh size={16} />}
              onClick={fetchData}
              loading={loading}
            >
              Refresh
            </Button>
            {filters.length > 0 && (
              <Button
                variant="subtle"
                size="xs"
                leftSection={showFilters ? <IconX size={16} /> : <IconFilter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            )}
          </Group>
        </Group>

        {showFilters && filters.length > 0 && (
          <Paper p="md" radius="sm" withBorder mb="md">
            <Grid gutter="md">
              {filters.map((filter, index) => (
                <Grid.Col key={filter.key} span={{ base: 12, sm: 6, md: 3 }}>
                  {renderFilterInput(filter)}
                </Grid.Col>
              ))}
            </Grid>
            
            <Group mt="md" justify="flex-end">
              <Button
                variant="light"
                leftSection={<IconX size={16} />}
                onClick={handleReset}
                disabled={loading}
              >
                Reset Filters
              </Button>
              <Button
                leftSection={<IconSearch size={16} />}
                onClick={handleSearch}
                loading={loading}
              >
                Apply Filters
              </Button>
            </Group>
          </Paper>
        )}

        <Group justify="space-between" mb="sm">
          <Group>
            <Text size="sm" c="dimmed">Items per page:</Text>
            <Select
              size="xs"
              w={80}
              value={limit.toString()}
              onChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
              data={['10', '25', '50', '100']}
            />
          </Group>
          <Text size="sm" c="dimmed">
            Showing {total === 0 ? '0' : ((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total}
          </Text>
        </Group>
      </Card>

      {/* Data Table Card */}
      <Card padding="lg" radius="md" withBorder>
        {loading ? (
          <Center h={400}>
            <Stack align="center">
              <Loader size="lg" />
              <Text c="dimmed">Loading data...</Text>
            </Stack>
          </Center>
        ) : data.length === 0 ? (
          <Center h={400}>
            <Stack align="center">
              <Text size="lg" c="dimmed">No records found</Text>
              <Text size="sm" c="dimmed">
                {activeFiltersCount > 0 
                  ? 'Try adjusting your filters' 
                  : 'Start by adding new records'}
              </Text>
              {activeFiltersCount > 0 && (
                <Button variant="light" onClick={handleReset} mt="sm">
                  Clear Filters
                </Button>
              )}
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={900}>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    {columns.map((column) => (
                      <Table.Th key={column.key || column.accessor}>
                        <SortableHeader 
                          field={column.sortField || column.accessor} 
                          sortable={column.sortable !== false}
                        >
                          {column.header}
                        </SortableHeader>
                      </Table.Th>
                    ))}
                    {actions && <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {totalPages > 1 && (
              <Flex justify="center" mt="xl">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  size="sm"
                  withEdges
                />
              </Flex>
            )}
          </>
        )}
      </Card>
    </Box>
  );
}