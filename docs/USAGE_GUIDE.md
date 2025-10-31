# Dynamic Form System - Complete Usage Guide

## 🎯 Overview

This is a **100% reusable** form system that works for **any entity** (Brands, Products, Reviews, Users, etc.). You only need to configure the fields once!

---

## 📁 File Structure

```
components/
├── DynamicForm/
│   └── DynamicForm.jsx          # Core reusable form component
└── admin-dashboard/
    ├── brand/
    │   ├── BrandView.jsx         # List view with navigation
    │   ├── AddBrand.jsx          # Add brand form
    │   └── EditBrand.jsx         # Edit brand form
    ├── product/
    │   ├── ProductView.jsx
    │   ├── AddProduct.jsx
    │   └── EditProduct.jsx
    └── review/
        ├── ReviewView.jsx
        ├── AddReview.jsx
        └── EditReview.jsx
```

---

## 🚀 Quick Start - Brand Implementation

### 1. Update API URLs (utils/apiUrl.js)

```javascript
export const BRAND_API = {
  GET_ALL_BRANDS: `${BASE_URL}/brands`,
  ADD_BRAND: `${BASE_URL}/brands`,  // ✅ Added for POST
  // Other endpoints...
};
```

### 2. Update BrandView.jsx

The updated version includes:
- ✅ Navigation to add page: `router.push('/admin/brands/add')`
- ✅ Navigation to edit page: `router.push('/admin/brands/edit/${id}')`
- ✅ Confirmation modal for delete with `@mantine/modals`

### 3. Create Add Brand Page

Use the `AddBrand.jsx` component - it's ready to go! Just place it at:
```
app/admin/brands/add/page.jsx
```

### 4. Create Edit Brand Page

Use the `EditBrand.jsx` component - it fetches existing data automatically! Place it at:
```
app/admin/brands/edit/[id]/page.jsx
```

---

## 🎨 Field Types Supported

The `DynamicForm` component supports these field types:

| Type | Description | Example Use Case |
|------|-------------|------------------|
| `text` | Single-line text input | Name, SKU, Phone |
| `email` | Email input with validation | Email addresses |
| `url` | URL input with validation | Website, Social links |
| `textarea` | Multi-line text | Descriptions, Notes |
| `number` | Numeric input | Price, Stock, Rating |
| `select` | Dropdown selection | Status, Category |
| `multiselect` | Multiple selections | Tags, Features |
| `switch` | Toggle boolean | Featured, Active |
| `file` | File upload with preview | Images, Logos |

---

## ⚙️ Field Configuration

Each field can have these properties:

```javascript
{
  name: 'fieldName',              // Required: Field key
  label: 'Field Label',           // Required: Display label
  type: 'text',                   // Required: Field type
  placeholder: 'Enter...',        // Optional: Placeholder text
  required: true,                 // Optional: Validation
  icon: <IconName size={16} />,   // Optional: Left icon
  span: 6,                        // Optional: Grid span (1-12)
  defaultValue: 'value',          // Optional: Default value
  
  // Type-specific options
  validate: (value) => {...},     // Custom validation
  options: [{value, label}],      // For select/multiselect
  min: 0,                         // For number
  max: 100,                       // For number
  step: 0.01,                     // For number
  minRows: 3,                     // For textarea
  maxRows: 8,                     // For textarea
  accept: 'image/*',              // For file
  previewSize: 100,               // For file preview
  searchable: true,               // For select
  clearable: true,                // For select
}
```

---

## 💡 Example: Adding a Review Form

```javascript
// AddReview.jsx
const reviewFields = [
  {
    name: 'productId',
    label: 'Product',
    type: 'select',
    required: true,
    options: products, // Fetch from API
    searchable: true,
    span: 12,
  },
  {
    name: 'rating',
    label: 'Rating',
    type: 'number',
    required: true,
    min: 1,
    max: 5,
    icon: <IconStar size={16} />,
    span: 6,
  },
  {
    name: 'title',
    label: 'Review Title',
    type: 'text',
    required: true,
    placeholder: 'Summarize your experience',
    span: 12,
  },
  {
    name: 'comment',
    label: 'Review',
    type: 'textarea',
    required: true,
    placeholder: 'Write your detailed review',
    minRows: 5,
    span: 12,
  },
  {
    name: 'images',
    label: 'Photos',
    type: 'file',
    accept: 'image/*',
    span: 12,
  },
  {
    name: 'recommended',
    label: 'Would you recommend this?',
    type: 'switch',
    switchLabel: 'I would recommend this product',
    span: 12,
  },
];

return (
  <DynamicForm
    title="Write a Review"
    fields={reviewFields}
    onSubmit={handleSubmit}
    onCancel={handleCancel}
    loading={loading}
  />
);
```

---

## 🔄 Form Data Handling

### File Uploads

The form automatically handles file uploads with FormData:

```javascript
const handleSubmit = async (values) => {
  const formData = new FormData();
  
  Object.keys(values).forEach((key) => {
    if (values[key] instanceof File) {
      formData.append('image', values[key]);
    } else {
      formData.append(key, values[key]);
    }
  });

  await axiosWrapper('post', API_URL, formData, token, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

### Array Fields (MultiSelect)

```javascript
// Stringify arrays before sending
if (Array.isArray(values.tags)) {
  formData.append('tags', JSON.stringify(values.tags));
}
```

---

## 🎯 Advanced Features

### 1. Custom Validation

```javascript
{
  name: 'email',
  validate: (value) => {
    if (!/^\S+@\S+$/.test(value)) {
      return 'Invalid email format';
    }
    return null;
  }
}
```

### 2. Conditional Fields

```javascript
const fields = [
  { name: 'type', type: 'select', options: [...] },
  // Only show if type is 'premium'
  ...(watchType === 'premium' ? [{
    name: 'premiumFeatures',
    type: 'multiselect',
    // ...
  }] : []),
];
```

### 3. Dynamic Options from API

```javascript
const [brands, setBrands] = useState([]);

useEffect(() => {
  const fetchBrands = async () => {
    const response = await axiosWrapper('get', BRAND_API.GET_ALL_BRANDS);
    setBrands(response.data.map(b => ({ 
      value: b._id, 
      label: b.name 
    })));
  };
  fetchBrands();
}, []);

// Use in field
{
  name: 'brandId',
  type: 'select',
  options: brands, // Dynamic options!
}
```

---

## 📋 Checklist for Adding New Entity

- [ ] Add API endpoints to `apiUrl.js`
- [ ] Create field configuration array
- [ ] Create `Add[Entity].jsx` with DynamicForm
- [ ] Create `Edit[Entity].jsx` with DynamicForm
- [ ] Update `[Entity]View.jsx` with navigation handlers
- [ ] Add routes in Next.js pages/app directory
- [ ] Test CRUD operations

---

## 🎨 Styling & Layout

### Grid System

Use `span` property to control layout (12-column grid):

```javascript
{ span: 12 }  // Full width
{ span: 6 }   // Half width
{ span: 4 }   // Third width
{ span: 3 }   // Quarter width
```

### Custom Styling

The form uses Mantine's design system. Customize via Mantine theme:

```javascript
// In your _app.jsx or layout
<MantineProvider theme={{
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  // ... other theme options
}}>
```

---

## 🐛 Common Issues & Solutions

### Issue: Form not submitting
**Solution:** Check that all required fields have values and validation passes.

### Issue: File preview not showing
**Solution:** Ensure `logoUrl` or image field is in initial values for edit mode.

### Issue: Select dropdown empty
**Solution:** Verify options array format: `[{value: 'x', label: 'X'}]`

### Issue: Router not navigating
**Solution:** Check route paths match your app directory structure.

---

## 🚀 Performance Tips

1. **Memoize field configurations** if they don't change
2. **Use `useCallback`** for submit handlers
3. **Debounce API calls** for dynamic option fetching
4. **Lazy load** heavy components

---

## 📦 Dependencies Required

```json
{
  "@mantine/core": "^7.x",
  "@mantine/form": "^7.x",
  "@mantine/notifications": "^7.x",
  "@mantine/modals": "^7.x",
  "@tabler/icons-react": "^2.x",
  "next": "^14.x"
}
```

---

## 🎉 Benefits

✅ **Write Once, Use Everywhere** - Same form component for all entities  
✅ **Type-Safe** - Built-in validation  
✅ **Consistent UX** - Uniform experience across admin panel  
✅ **Easy Maintenance** - Update form logic in one place  
✅ **Quick Development** - Add new forms in minutes  
✅ **File Upload Ready** - Handles images/files automatically  
✅ **Responsive** - Mobile-friendly grid system  

---

## 🤝 Contributing

To extend with new field types, edit `DynamicForm.jsx` and add case in `renderField`:

```javascript
case 'your_new_type':
  return (
    <YourCustomInput {...commonProps} />
  );
```

---

**Happy Coding! 🎨✨**