'use client';

/**
 * UserForm Component
 * A standardized form for creating and editing platform members.
 */
import { User, Mail, Lock, Shield } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import useForm from '../../hooks/useForm';

const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Administrator' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Installer', label: 'Installer' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Customer', label: 'Customer' }
];

export default function UserForm({ onSubmit, onCancel, initialValues = {} }) {
  const { values, isSubmitting, handleChange, handleSubmit } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'Customer',
    ...initialValues
  });

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    if (!values.password && !initialValues.id) errors.password = 'Password is required';
    if (values.password && values.password.length < 8) errors.password = 'Password must be at least 8 characters';
    return errors;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, validate)} className="space-y-2">
      <Input
        label="Full Name"
        name="name"
        type="text"
        placeholder="John Doe"
        value={values.name}
        onChange={handleChange}
        icon={User}
        required
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="email@example.com"
        value={values.email}
        onChange={handleChange}
        icon={Mail}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Min. 8 characters"
        value={values.password}
        onChange={handleChange}
        icon={Lock}
        required={!initialValues.id}
      />

      <Select
        label="Role"
        name="role"
        value={values.role}
        onChange={handleChange}
        options={ROLE_OPTIONS}
        icon={Shield}
      />

      <footer className="flex gap-4 mt-8 pt-6 border-t border-border">
        <Button 
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-1"
        >
          {initialValues.id ? 'Save Changes' : 'Create Member'}
        </Button>
      </footer>
    </form>
  );
}
