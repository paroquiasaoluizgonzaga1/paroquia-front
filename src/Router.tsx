import { Routes, Route } from 'react-router-dom';
import { PendingMembers } from './pages/admin/pending-members';
import { AdminLayout } from './layouts/AdminLayout';
import Login from './pages/access/login';
import ForgotPassword from './pages/access/forgot-password';
import ResetPassword from './pages/access/reset-password';
import CreateAccount from './pages/access/create-account';
import { EditMember } from './pages/admin/edit-member';
import { Members } from './pages/admin/members';
import { ManagerLayout } from './layouts/ManagerLayout';
import { Profile } from './pages/profile';
import { Home } from './pages/home';
import { AddNews } from './pages/news/add-news';
import { NewsList } from './pages/news/news-list';
import { EditNews } from './pages/news/edit.news';
import { MassLocationsList } from './pages/massLocations/mass-locations-list';
import { AddMassLocation } from './pages/massLocations/add-mass-location';
import { EditMassLocation } from './pages/massLocations/edit-mass-location';
import { TransparencyPortal } from './pages/transparencyPortal/transparency-portal';
import { SacramentsList } from './pages/sacraments/sacraments-list';
import { GroupsAndServicesList } from './pages/groupsAndServices/groups-and-services-list';
import { AddSacrament } from './pages/sacraments/add-sacrament';
import { EditSacrament } from './pages/sacraments/edit-sacrament';
import { EditGroupOrService } from './pages/groupsAndServices/edit-group-or-service';
import { AddGroupOrService } from './pages/groupsAndServices/add-group-or-service';

export function Router() {
    return (
        <Routes>
            <Route path="admin" element={<AdminLayout />}>
                <Route path="membros">
                    <Route path="convites" element={<PendingMembers />} />
                    <Route path="" element={<Members />} />
                    <Route path="editar/:id" element={<EditMember />} />
                </Route>
            </Route>
            <Route path="" element={<ManagerLayout />}>
                <Route path="" element={<Home />} />
                <Route path="perfil" element={<Profile />} />
                <Route path="comunicados">
                    <Route path="novo" element={<AddNews />} />
                    <Route path="editar/:id" element={<EditNews />} />
                    <Route path="" element={<NewsList />} />
                </Route>
                <Route path="matriz-e-capelas">
                    <Route path="novo" element={<AddMassLocation />} />
                    <Route path="editar/:id" element={<EditMassLocation />} />
                    <Route path="" element={<MassLocationsList />} />
                </Route>
                <Route path="portal-de-transparencia" element={<TransparencyPortal />} />
                <Route path="sacramentos">
                    <Route path="" element={<SacramentsList />} />
                    <Route path="novo" element={<AddSacrament />} />
                    <Route path="editar/:id" element={<EditSacrament />} />
                </Route>
                <Route path="pastorais-grupos-e-servicos">
                    <Route path="" element={<GroupsAndServicesList />} />
                    <Route path="novo" element={<AddGroupOrService />} />
                    <Route path="editar/:id" element={<EditGroupOrService />} />
                </Route>
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="criar-conta" element={<CreateAccount />} />
            <Route path="recuperar-senha" element={<ForgotPassword />} />
            <Route path="redefinir-senha" element={<ResetPassword />} />
        </Routes>
    );
}
