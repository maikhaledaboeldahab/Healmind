import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import UserRegisterForm from './UserRegisterForm';
import DoctorRegisterForm from './DoctorRegisterForm';
import DoctorPending from './DoctorPending';

export default function Register() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState(
    initialRole === 'doctor' || initialRole === 'user' ? initialRole : null
  );
  const [isPending, setIsPending] = useState(searchParams.get('status') === 'pending');

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setSearchParams(role ? { role } : {});
  };

  const handleBack = () => {
    setSelectedRole(null);
    setIsPending(false);
    setSearchParams({});
  };

  const handleDoctorSuccess = () => {
    setIsPending(true);
    setSearchParams({ status: 'pending' });
  };

  if (isPending) {
    return <DoctorPending />;
  }

  if (selectedRole === 'user') {
    return <UserRegisterForm onBack={handleBack} />;
  }

  if (selectedRole === 'doctor') {
    return (
      <DoctorRegisterForm
        onBack={handleBack}
        onSuccess={handleDoctorSuccess}
      />
    );
  }

  return <RoleSelection onSelectRole={handleSelectRole} />;
}
