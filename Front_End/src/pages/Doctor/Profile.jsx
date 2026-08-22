import ProfileCard from "../../components/Doctor/ProfileCard/ProfileCard";
import PersonalInfo from "../../components/Doctor/PersonalInfo/PersonalInfo";

const initialInfo = {
  email: "farah@healmind.com",
  phone: "+20 100 123 4567",
  specialization: "Clinical Psychology",
  yearsExperience: "8",
};

const Profile = () => {
  return (
    <div>
      <h3 className="fw-bold mb-4">My Professional Profile</h3>
      <ProfileCard
        doctorName="Farah"
        title="Clinical Psychologist"
        verificationStatus="approved"
      />
      <PersonalInfo initialData={initialInfo} onSave={(data) => console.log("Saved:", data)} />
    </div>
  );
};

export default Profile;