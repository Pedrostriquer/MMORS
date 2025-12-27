import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Tags, 
  Sparkles, 
  Globe, 
  Percent, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2 className="logo">M MORS</h2>}
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={20} className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/dashboard/produtos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Package size={20} className="icon" />
          <span>Produtos</span>
        </NavLink>

        <NavLink to="/admin/dashboard/categorias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Tags size={20} className="icon" />
          <span>Categorias</span>
        </NavLink>

        <NavLink to="/admin/dashboard/colecoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Sparkles size={20} className="icon" />
          <span>Coleções</span>
        </NavLink>

        <NavLink to="/admin/dashboard/navbar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Globe size={20} className="icon" />
          <span>Navegação</span>
        </NavLink>

        <NavLink to="/admin/dashboard/promocoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Percent size={20} className="icon" />
          <span>Promoções</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={20} className="icon" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;