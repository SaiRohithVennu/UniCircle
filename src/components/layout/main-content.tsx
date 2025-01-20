import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { ProfilePage } from '@/pages/profile';
import { CreateProjectPage } from '@/pages/create-project';
import { SearchPage } from '@/pages/search';
import { DepartmentsPage } from '@/pages/departments';
import { StudentProfilePage } from '@/pages/student-profile';
import { ProjectsPage } from '@/pages/projects';

export function MainContent() {
  return (
    <main className="md:ml-[245px] md:w-[calc(100%-245px)] min-h-screen bg-white pb-16 md:pb-0">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/create" element={<CreateProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/students/:id" element={<StudentProfilePage />} />
      </Routes>
    </main>
  );
}