// components/DynamicForm/DynamicForm.jsx
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
import {
  IconUpload,
  IconX,
  IconCheck,
  IconArrowLeft,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export default function DynamicForm({
  title,
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  isEdit = false,
  loading = false,
}) {
  const [imagePreview, setImagePreview] = useState(initialValues?.logoUrl || null);

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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      form.setFieldValue(fieldName, file);
    } else {
      setImagePreview(null);
      form.setFieldValue(fieldName, null);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      placeholder: field.placeholder,
      description: field.description,
      required: field.required,
      disabled: loading || field.disabled,
      leftSection: field.icon,
      ...form.getInputProps(field.name),
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <TextInput
            {...commonProps}
            type={field.type}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            minRows={field.minRows || 3}
            maxRows={field.maxRows || 6}
            autosize={field.autosize !== false}
          />
        );

      case 'number':
        return (
          <NumberInput
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            decimalScale={field.decimalScale}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            data={field.options || []}
            searchable={field.searchable}
            clearable={field.clearable}
          />
        );

      case 'multiselect':
        return (
          <MultiSelect
            {...commonProps}
            data={field.options || []}
            searchable={field.searchable}
            clearable={field.clearable}
          />
        );

      case 'switch':
        return (
          <Switch
            {...commonProps}
            label={field.switchLabel || field.label}
            description={field.description}
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
        return (
          <TextInput
            {...commonProps}
          />
        );
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