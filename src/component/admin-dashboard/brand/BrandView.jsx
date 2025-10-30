'use client';

import { useState, useEffect, useMemo } from 'react';
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
  IconMail,
  IconPhone,
  IconMapPin,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useSearchParams } from 'next/navigation';

import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { BRAND_API } from '../../../utils/apiUrl';

export default function BrandsOverviewPage() {
  const searchParams = useSearchParams();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filter states
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchPostcode, setSearchPostcode] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sort states
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Initialize state from URL params on mount
  useEffect(() => {
    if (!searchParams) return;
    
    const getParam = (key) => searchParams.get(key) || '';
    
    setPage(Number(searchParams.get('page')) || 1);
    setLimit(Number(searchParams.get('limit')) || 10);
    setSearchName(getParam('name'));
    setSearchEmail(getParam('email'));
    setSearchPhone(getParam('phoneNumber'));
    setSearchPostcode(getParam('postcode'));
    setStatusFilter(getParam('status'));
    setSortBy(getParam('sortBy') || 'createdAt');
    setSortOrder(getParam('sortOrder') || 'desc');
  }, [searchParams]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const token = useAuthStore.getState().token;
      
      // Build params object - only include non-empty values
      const params = {
        page,
        limit,
      };

      // Add filters only if they have values
      if (searchName.trim()) params.name = searchName.trim();
      if (searchEmail.trim()) params.email = searchEmail.trim();
      if (searchPhone.trim()) params.phoneNumber = searchPhone.trim();
      if (searchPostcode.trim()) params.postcode = searchPostcode.trim();
      if (statusFilter) params.status = statusFilter;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      // Update URL to match current state
      updateURL(params);

      const response = await axiosWrapper(
        'get',
        BRAND_API.GET_ALL_BRANDS,
        {},
        token,
        { params }
      );
      
      // Handle the API response structure you provided
      if (response.data?.data) {
        setBrands(response.data.data || []);
        
        const pagination = response.data.data.pagination;
        if (pagination) {
          setTotal(pagination.total || 0);
          setTotalPages(pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Fetch brands error:', err);
      notifications.show({
        title: 'Error',
        message: err?.response?.data?.message || err?.message || 'Failed to fetch brands',
        color: 'red',
      });
      // Reset to empty state on error
      setBrands([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Update URL without triggering navigation
  const updateURL = (params) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.set(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {
      console.error('URL update error:', e);
    }
  };

  // Fetch brands when dependencies change
  useEffect(() => {
    // Don't fetch on initial mount - wait for URL params to be loaded first
    if (page === 1 && limit === 10 && !searchParams) return;
    
    fetchBrands();
  }, [page, limit, sortBy, sortOrder]);

  const handleSearch = () => {
    // Reset to page 1 when applying filters
    setPage(1);
    // Trigger fetch with current filter values
    setTimeout(() => fetchBrands(), 0);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchPhone('');
    setSearchPostcode('');
    setStatusFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
    
    // Trigger fetch after state updates
    setTimeout(() => fetchBrands(), 0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleDelete = async (brand) => {
    setSelectedBrand(brand);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = useAuthStore.getState().token;
      await axiosWrapper(
        'delete',
        `${BRAND_API.DELETE_BRAND || BRAND_API.GET_ALL_BRANDS}/${selectedBrand._id}`,
        {},
        token
      );
      
      notifications.show({
        title: 'Success',
        message: 'Brand deleted successfully',
        color: 'green',
      });
      
      setDeleteModalOpen(false);
      setSelectedBrand(null);
      fetchBrands();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err?.response?.data?.message || err?.message || 'Failed to delete brand',
        color: 'red',
      });
    }
  };

  const exportToCSV = () => {
    if (brands.length === 0) {
      notifications.show({
        title: 'No Data',
        message: 'No brands to export',
        color: 'orange',
      });
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Website', 'Postcode', 'Status'];
    const csvContent = [
      headers.join(','),
      ...brands.map(b => [
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${(b.email || '').replace(/"/g, '""')}"`,
        `"${(b.phoneNumber || '').replace(/"/g, '""')}"`,
        `"${(b.websiteUrl || '').replace(/"/g, '""')}"`,
        `"${(b.postcode || '').replace(/"/g, '""')}"`,
        `"${(b.status || '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brands_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const SortableHeader = ({ children, field }) => (
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

  const activeFiltersCount = [
    searchName,
    searchEmail,
    searchPhone,
    searchPostcode,
    statusFilter
  ].filter(v => v && v.trim()).length;

  const rows = brands.map((brand) => (
    <Table.Tr key={brand._id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar 
            src={brand.logoUrl} 
            radius="xl" 
            size="md"
            alt={brand.name}
          >
            {brand.name?.charAt(0) || '?'}
          </Avatar>
          <div>
            <Text fw={500} size="sm">{brand.name || 'Unnamed Brand'}</Text>
            <Text size="xs" c="dimmed">
              {brand.description ? `${brand.description.substring(0, 30)}...` : 'No description'}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={6}>
          <IconMail size={14} opacity={0.6} />
          <Text size="sm">{brand.email || '-'}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={6}>
          <IconPhone size={14} opacity={0.6} />
          <Text size="sm">{brand.phoneNumber || '-'}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={6}>
          <IconMapPin size={14} opacity={0.6} />
          <Text size="sm">{brand.postcode || '-'}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge 
          color={brand.status === 'ACTIVE' ? 'green' : 'gray'} 
          variant="light"
          size="sm"
        >
          {brand.status || 'UNKNOWN'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Tooltip label="View Details">
            <ActionIcon variant="light" color="blue" size="sm">
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Brand">
            <ActionIcon variant="light" color="yellow" size="sm">
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Brand">
            <ActionIcon 
              variant="light" 
              color="red" 
              size="sm"
              onClick={() => handleDelete(brand)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Brands Management</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage your brand catalog ({total} total brands)
          </Text>
        </div>
        <Group>
          <Button 
            leftSection={<IconDownload size={18} />} 
            variant="light"
            onClick={exportToCSV}
            disabled={brands.length === 0}
          >
            Export CSV
          </Button>
          <Button leftSection={<IconPlus size={18} />} variant="filled">
            Add New Brand
          </Button>
        </Group>
      </Group>

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
              onClick={fetchBrands}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftSection={showFilters ? <IconX size={16} /> : <IconFilter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </Group>
        </Group>

        {showFilters && (
          <Paper p="md" radius="sm" withBorder mb="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Brand Name"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  leftSection={<IconSearch size={16} />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Email"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  leftSection={<IconMail size={16} />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Phone"
                  placeholder="Search by phone..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  leftSection={<IconPhone size={16} />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Postcode"
                  placeholder="Search by postcode..."
                  value={searchPostcode}
                  onChange={(e) => setSearchPostcode(e.target.value)}
                  leftSection={<IconMapPin size={16} />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="Status"
                  placeholder="All statuses"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  data={[
                    { value: '', label: 'All Statuses' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'INACTIVE', label: 'Inactive' },
                  ]}
                  clearable
                />
              </Grid.Col>
            </Grid>
            
            <Group mt="md" justify="flex-end">
              <Button
                variant="light"
                leftSection={<IconX size={16} />}
                onClick={handleReset}
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

      <Card padding="lg" radius="md" withBorder>
        {loading ? (
          <Center h={400}>
            <Stack align="center">
              <Loader size="lg" />
              <Text c="dimmed">Loading brands...</Text>
            </Stack>
          </Center>
        ) : brands.length === 0 ? (
          <Center h={400}>
            <Stack align="center">
              <Text size="lg" c="dimmed">No brands found</Text>
              <Text size="sm" c="dimmed">Try adjusting your filters or add a new brand</Text>
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={900}>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th><SortableHeader field="name">Brand</SortableHeader></Table.Th>
                    <Table.Th><SortableHeader field="email">Email</SortableHeader></Table.Th>
                    <Table.Th><SortableHeader field="phoneNumber">Phone</SortableHeader></Table.Th>
                    <Table.Th><SortableHeader field="postcode">Postcode</SortableHeader></Table.Th>
                    <Table.Th><SortableHeader field="status">Status</SortableHeader></Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card padding="lg" radius="md" style={{ width: '90%', maxWidth: 400 }}>
            <Title order={4} mb="md">Confirm Delete</Title>
            <Text mb="md">
              Are you sure you want to delete <strong>{selectedBrand?.name}</strong>? This action cannot be undone.
            </Text>
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={confirmDelete}>
                Delete Brand
              </Button>
            </Group>
          </Card>
        </div>
      )}
    </Box>
  );
}