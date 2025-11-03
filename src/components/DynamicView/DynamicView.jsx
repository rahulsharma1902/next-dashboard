// components/DynamicView/DynamicView.jsx
'use client';

import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  Divider,
  Button,
  ActionIcon,
  Grid,
  Box,
  Card,
  Image,
  Rating,
  Tooltip,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconCalendar,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconPackage,
  IconStar,
  IconMessage,
  IconBuildingStore,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useState } from 'react';

/**
 * DynamicView Component - Display detailed view of any entity
 * 
 * @param {string} title - Page title
 * @param {object} data - Entity data to display
 * @param {array} fields - Field configuration array
 * @param {boolean} loading - Loading state
 * @param {function} onEdit - Edit callback
 * @param {function} onDelete - Delete callback
 * @param {function} onBack - Back navigation callback
 * @param {array} customActions - Additional custom action buttons
 */
export default function DynamicView({
  title,
  data,
  fields = [],
  loading = false,
  onEdit,
  onDelete,
  onBack,
  customActions = [],
}) {
  const [imageError, setImageError] = useState(false);

  // Get field value from data
  const getFieldValue = (field) => {
    if (field.accessor) {
      if (typeof field.accessor === 'function') {
        return field.accessor(data);
      }
      // Handle nested properties like 'brandId.name'
      const keys = field.accessor.split('.');
      let value = data;
      for (const key of keys) {
        value = value?.[key];
      }
      return value;
    }
    return data[field.name];
  };

  // Render field value based on type
  const renderFieldValue = (field) => {
    const value = getFieldValue(field);

    // If custom render function is provided
    if (field.render) {
      return field.render(value, data);
    }

    // Handle null/undefined
    if (value === null || value === undefined || value === '') {
      return <Text c="dimmed">-</Text>;
    }

    // Render based on field type
    switch (field.type) {
      case 'image':
        return (
          <Box>
            {!imageError ? (
              <Image
                src={value}
                alt={field.label}
                radius={field.radius || 'md'}
                h={field.height || 200}
                w={field.width || 'auto'}
                fit={field.fit || 'contain'}
                onError={() => setImageError(true)}
                fallbackSrc="https://via.placeholder.com/200?text=No+Image"
              />
            ) : (
              <Avatar
                size={field.height || 200}
                radius={field.radius || 'md'}
              >
                {field.label?.charAt(0) || '?'}
              </Avatar>
            )}
          </Box>
        );

      case 'avatar':
        return (
          <Avatar
            src={value}
            size={field.size || 'lg'}
            radius={field.radius || 'xl'}
            alt={field.label}
          >
            {data.name?.charAt(0)?.toUpperCase() || '?'}
          </Avatar>
        );

      case 'badge':
        return (
          <Badge
            color={field.getColor ? field.getColor(value) : 'blue'}
            variant={field.variant || 'light'}
            size={field.size || 'md'}
          >
            {value}
          </Badge>
        );

      case 'rating':
        return (
          <Group gap="xs">
            <Rating value={parseFloat(value) || 0} readOnly size={field.size || 'md'} />
            <Text size="sm" fw={500}>
              {parseFloat(value).toFixed(1)}
            </Text>
          </Group>
        );

      case 'boolean':
        return (
          <Badge color={value ? 'green' : 'red'} variant="light">
            {value ? <IconCheck size={14} /> : <IconX size={14} />}
            <Text ml={4}>{value ? 'Yes' : 'No'}</Text>
          </Badge>
        );

      case 'date':
        return (
          <Group gap="xs">
            <IconCalendar size={16} opacity={0.6} />
            <Text size="sm">{new Date(value).toLocaleDateString()}</Text>
          </Group>
        );

      case 'datetime':
        return (
          <Stack gap={2}>
            <Group gap="xs">
              <IconCalendar size={14} opacity={0.6} />
              <Text size="sm">{new Date(value).toLocaleDateString()}</Text>
            </Group>
            <Text size="xs" c="dimmed" pl={20}>
              {new Date(value).toLocaleTimeString()}
            </Text>
          </Stack>
        );

      case 'email':
        return (
          <Group gap="xs">
            <IconMail size={16} opacity={0.6} />
            <Text size="sm">{value}</Text>
          </Group>
        );

      case 'phone':
        return (
          <Group gap="xs">
            <IconPhone size={16} opacity={0.6} />
            <Text size="sm">{value}</Text>
          </Group>
        );

      case 'url':
        return (
          <Group gap="xs">
            <IconWorld size={16} opacity={0.6} />
            <Text
              size="sm"
              component="a"
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              c="blue"
              td="underline"
            >
              {value}
            </Text>
          </Group>
        );

      case 'textarea':
      case 'longtext':
        return (
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {value}
          </Text>
        );

      case 'currency':
        return (
          <Text size="sm" fw={500}>
            ${parseFloat(value).toFixed(2)}
          </Text>
        );

      case 'number':
        return (
          <Text size="sm" fw={500}>
            {field.format ? field.format(value) : value}
          </Text>
        );

      case 'array':
        if (Array.isArray(value)) {
          return (
            <Group gap="xs">
              {value.map((item, idx) => (
                <Badge key={idx} variant="light" size="sm">
                  {typeof item === 'object' ? item.name || item.label : item}
                </Badge>
              ))}
            </Group>
          );
        }
        return <Text c="dimmed">-</Text>;

      case 'list':
        if (Array.isArray(value)) {
          return (
            <Stack gap={4}>
              {value.map((item, idx) => (
                <Text key={idx} size="sm">
                  • {typeof item === 'object' ? item.name || item.label : item}
                </Text>
              ))}
            </Stack>
          );
        }
        return <Text c="dimmed">-</Text>;

      default:
        return <Text size="sm">{value.toString()}</Text>;
    }
  };

  // Group fields by section
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || 'General Information';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {});

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />

      {/* Header */}
      <Paper shadow="sm" p="lg" radius="md" mb="md">
        <Group justify="space-between">
          <Group>
            {onBack && (
              <ActionIcon variant="subtle" onClick={onBack} size="lg">
                <IconArrowLeft size={20} />
              </ActionIcon>
            )}
            <Title order={2}>{title}</Title>
          </Group>

          <Group gap="xs">
            {customActions.map((action, idx) => (
              <Tooltip key={idx} label={action.label}>
                <Button
                  variant={action.variant || 'light'}
                  color={action.color || 'blue'}
                  leftSection={action.icon}
                  onClick={() => action.onClick(data)}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              </Tooltip>
            ))}
            
            {onEdit && (
              <Button
                variant="light"
                color="yellow"
                leftSection={<IconEdit size={18} />}
                onClick={() => onEdit(data)}
              >
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size={18} />}
                onClick={() => onDelete(data)}
              >
                Delete
              </Button>
            )}
          </Group>
        </Group>
      </Paper>

      {/* Content - Sections */}
      {Object.entries(groupedFields).map(([sectionName, sectionFields]) => (
        <Paper key={sectionName} shadow="sm" p="lg" radius="md" mb="md">
          <Title order={4} mb="lg">
            {sectionName}
          </Title>

          <Grid>
            {sectionFields.map((field) => (
              <Grid.Col
                key={field.name}
                span={field.span || 6}
                style={{ display: field.hidden ? 'none' : 'block' }}
              >
                <Stack gap="xs">
                  <Group gap="xs">
                    {field.icon}
                    <Text size="sm" fw={600} c="dimmed">
                      {field.label}
                    </Text>
                  </Group>
                  <Box pl={field.icon ? 24 : 0}>
                    {renderFieldValue(field)}
                  </Box>
                </Stack>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      ))}

      {/* Metadata (Created/Updated timestamps) */}
      {(data.createdAt || data.updatedAt) && (
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between">
            {data.createdAt && (
              <Group gap="xs">
                <Text size="xs" c="dimmed">Created:</Text>
                <Text size="xs" fw={500}>
                  {new Date(data.createdAt).toLocaleString()}
                </Text>
              </Group>
            )}
            {data.updatedAt && (
              <Group gap="xs">
                <Text size="xs" c="dimmed">Last Updated:</Text>
                <Text size="xs" fw={500}>
                  {new Date(data.updatedAt).toLocaleString()}
                </Text>
              </Group>
            )}
          </Group>
        </Paper>
      )}
    </Box>
  );
}