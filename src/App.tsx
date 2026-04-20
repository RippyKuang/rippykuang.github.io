/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import Projects from './pages/Projects';
import ProjectPage from './pages/ProjectPage';
import Categories from './pages/Categories';
import Search from './pages/Search';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project/:id" element={<ProjectPage />} />
          <Route path="categories" element={<Categories />} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
