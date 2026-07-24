import {NavLink} from "react-router-dom";
import styles from "./DoctorSidebar.module.css";

const links = [
    {icon:"fa-solid fa-chart-pie", text: "Dashboard", path:"/doctor/dashboard"},
    {icon:"fa-solid fa-users", text: "Patients", path:"/doctor/patients"},
    {icon:"fa-solid fa-business-time", text: "Sessions", path:"/doctor/sessions"},
    {icon:"fa-regular fa-calendar-days", text: "Availability", path:"/doctor/availability"},
    {icon:"fa-regular fa-user", text: "Profile", path:"/doctor/profile"},
];

const DoctorSidebar =()=>{
    return(
        <aside className={`${styles.sidebar} min-vh-100 d-flex flex-column py-4`}>
            <div className={`${styles.brand} px-4 mb-4`}>HealMind</div>
            <nav className="d-flex flex-column gap-1">
                {links.map((item) =>(
                    <NavLink
                    key={item.path}
                    to={item.path}
                    className={({isActive}) => 
                    `${styles.navItem} ${isActive ? styles.active : ""} d-flex align-items-center gap-3 px-4`}>
                        <i className={`fa-solid ${item.icon} fs-6`}></i>
                        <span>{item.text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default DoctorSidebar;