import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';
import '../index.css';

const rootElement = document.getElementById('admin-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>
  );
}
