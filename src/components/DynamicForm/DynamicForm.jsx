'use client';

import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  NumberInput,
  Switch,
  Button,
  Group,
  Box,
  Paper,
  Title,
  Text,
  FileInput,
  Grid,
  Avatar,
  Stack,
  ActionIcon,
  Divider,
} from '@mantine/core';
import { IconUpload, IconX, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';

export default function DynamicForm({
  title,
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  isEdit = false,
  loading = false,
}) {
  const [imagePreview, setImagePreview] = useState(initialValues?.image || initialValues?.logoUrl || null);
  const [asyncOptions, setAsyncOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});

  // Initialize form with validation
  const form = useForm({
    initialValues: {
      ...fields.reduce((acc, field) => {
        acc[field.name] = initialValues[field.name] ?? field.defaultValue ?? '';
        return acc;
      }, {}),
    },
    validate: fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = (value) => {
          if (field.type === 'file') return null;
          if (field.type === 'checkbox' && !value) {
            return field.errorMessage || `${field.label} is required`;
          }
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return field.errorMessage || `${field.label} is required`;
          }
          return null;
        };
      }
      if (field.validate) {
        acc[field.name] = field.validate;
      }
      return acc;
    }, {}),
  });

  // Load async options for select fields
  useEffect(() => {
    fields.forEach(async (field) => {
      if (field.type === 'select' && field.filterFunction && field.loadOnMount) {
        setLoadingOptions(prev => ({ ...prev, [field.name]: true }));
        try {
          const options = await field.filterFunction('');
          setAsyncOptions(prev => ({ ...prev, [field.name]: options }));
        } catch (error) {
          console.error(`Failed to load options for ${field.name}:`, error);
          setAsyncOptions(prev => ({ ...prev, [field.name]: [] }));
        } finally {
          setLoadingOptions(prev => ({ ...prev, [field.name]: false }));
        }
      }
    });
  }, [fields]);

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Something went wrong',
        color: 'red',
      });
    }
  };

  const handleFileChange = (file, fieldName) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      form.setFieldValue(fieldName, file);
    } else {
      setImagePreview(null);
      form.setFieldValue(fieldName, null);
    }
  };

  const handleAsyncSearch = async (fieldName, filterFunction, searchQuery) => {
    setLoadingOptions(prev => ({ ...prev, [fieldName]: true }));
    try {
      const options = await filterFunction(searchQuery);
      setAsyncOptions(prev => ({ ...prev, [fieldName]: options }));
    } catch (error) {
      console.error(`Failed to search options for ${fieldName}:`, error);
    } finally {
      setLoadingOptions(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const renderField = (field) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      description: field.description,
      required: field.required,
      disabled: loading || field.disabled,
      leftSection: field.icon,
      ...form.getInputProps(field.name, { type: field.type === 'checkbox' ? 'checkbox' : undefined }),
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return <TextInput key={field.name} {...commonProps} type={field.type} error={form.errors[field.name]} />;

      case 'textarea':
        return (
          <Textarea
            key={field.name}
            {...commonProps}
            minRows={field.minRows || 3}
            maxRows={field.maxRows || 6}
            autosize={field.autosize !== false}
            error={form.errors[field.name]}
          />
        );

      case 'number':
        return (
          <NumberInput
            key={field.name}
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            decimalScale={field.decimalScale}
            error={form.errors[field.name]}
          />
        );

      case 'select':
        const selectProps = {
          ...commonProps,
          data: asyncOptions[field.name] || field.options || [],
          searchable: field.searchable,
          clearable: field.clearable,
          nothingFound: loadingOptions[field.name] ? 'Loading...' : 'No options found',
          error: form.errors[field.name],
        };
        if (field.filterFunction) {
          selectProps.onSearchChange = (query) => handleAsyncSearch(field.name, field.filterFunction, query);
        }
        return <Select key={field.name} {...selectProps} />;

      case 'multiselect':
        return (
          <MultiSelect
            key={field.name}
            {...commonProps}
            data={field.options || []}
            searchable={field.searchable}
            clearable={field.clearable}
            error={form.errors[field.name]}
          />
        );

      case 'switch':
        return (
          <Switch
            key={field.name}
            label={field.switchLabel || field.label}
            description={field.description}
            checked={form.values[field.name]}
            onChange={(event) => form.setFieldValue(field.name, event.currentTarget.checked)}
            error={form.errors[field.name]}
            disabled={loading || field.disabled}
          />
        );

      case 'checkbox':
        return (
          <Switch
            key={field.name}
            label={field.label}
            checked={form.values[field.name]}
            onChange={(event) => form.setFieldValue(field.name, event.currentTarget.checked)}
            error={form.errors[field.name]}
            disabled={loading || field.disabled}
          />
        );

      case 'file':
        return (
          <Box key={field.name}>
            <FileInput
              label={field.label}
              placeholder={field.placeholder || 'Upload file'}
              accept={field.accept || 'image/*'}
              leftSection={field.icon || <IconUpload size={16} />}
              required={field.required}
              disabled={loading}
              onChange={(file) => handleFileChange(file, field.name)}
              clearable
              error={form.errors[field.name]}
            />
            {imagePreview && (
              <Box mt="md">
                <Text size="sm" fw={500} mb="xs">Preview:</Text>
                <Avatar
                  src={imagePreview}
                  size={field.previewSize || 120}
                  radius={field.previewRadius || 'md'}
                  alt="Preview"
                />
              </Box>
            )}
          </Box>
        );

      default:
        return <TextInput key={field.name} {...commonProps} error={form.errors[field.name]} />;
    }
  };

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Group justify="space-between" mb="xl">
        <Title order={2}>{title}</Title>
        {onCancel && (
          <ActionIcon variant="subtle" onClick={onCancel} size="lg">
            <IconArrowLeft size={20} />
          </ActionIcon>
        )}
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            {fields.map((field) => (
              <Grid.Col key={field.name} span={field.span || 12}>
                {renderField(field)}
              </Grid.Col>
            ))}
          </Grid>

          <Divider my="md" />

          <Group justify="flex-end" mt="xl">
            {onCancel && (
              <Button
                variant="default"
                onClick={onCancel}
                leftSection={<IconX size={16} />}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              leftSection={<IconCheck size={16} />}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
