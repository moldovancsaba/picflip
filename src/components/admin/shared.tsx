import styled from 'styled-components';
import { tokens } from './tokens';

// Layout Components
export const Container = styled.div`
  padding: ${tokens.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.xl};
`;

export const Title = styled.h1`
  color: ${tokens.colors.text};
  margin: 0;
  font-size: ${tokens.typography.fontSizes['2xl']};
  font-weight: ${tokens.typography.fontWeights.bold};
`;

// Button Components
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${tokens.transitions.base};
  border: 1px solid;
  
  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${tokens.colors.primary};
          color: white;
          border-color: ${tokens.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${tokens.colors.primaryHover};
            border-color: ${tokens.colors.primaryHover};
          }
        `;
      case 'danger':
        return `
          background: ${tokens.colors.error};
          color: white;
          border-color: ${tokens.colors.error};
          
          &:hover:not(:disabled) {
            background: #b91c1c;
            border-color: #b91c1c;
          }
        `;
      case 'success':
        return `
          background: ${tokens.colors.success};
          color: white;
          border-color: ${tokens.colors.success};
          
          &:hover:not(:disabled) {
            background: #059669;
            border-color: #059669;
          }
        `;
      default:
        return `
          background: ${tokens.colors.background};
          color: ${tokens.colors.secondary};
          border-color: ${tokens.colors.border};
          
          &:hover:not(:disabled) {
            background: ${tokens.colors.backgroundSecondary};
            border-color: ${tokens.colors.textMuted};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${tokens.colors.focus};
  }
`;

export const IconButton = styled(Button)`
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  font-size: ${tokens.typography.fontSizes.xs};
`;

// Card Components
export const Card = styled.div`
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.xl};
  box-shadow: ${tokens.shadows.sm};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${tokens.spacing.lg};
`;

export const CardTitle = styled.h3`
  font-size: ${tokens.typography.fontSizes.lg};
  font-weight: ${tokens.typography.fontWeights.semibold};
  color: ${tokens.colors.text};
  margin: 0 0 ${tokens.spacing.xs} 0;
`;

export const CardSubtitle = styled.div`
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.typography.fontSizes.sm};
  font-family: monospace;
  background: ${tokens.colors.backgroundSecondary};
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.base};
  display: inline-block;
`;

export const CardContent = styled.div`
  color: ${tokens.colors.textSecondary};
  line-height: 1.5;
  margin: ${tokens.spacing.sm} 0;
`;

export const CardMeta = styled.div`
  display: flex;
  gap: ${tokens.spacing.lg};
  font-size: ${tokens.typography.fontSizes.sm};
  color: ${tokens.colors.textSecondary};
  margin-top: ${tokens.spacing.lg};
  padding-top: ${tokens.spacing.lg};
  border-top: 1px solid ${tokens.colors.borderLight};
`;

// Table Components
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${tokens.spacing.lg};
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.border};
  font-weight: ${tokens.typography.fontWeights.semibold};
  color: ${tokens.colors.secondary};
  background: ${tokens.colors.backgroundSecondary};
`;

export const TableCell = styled.td`
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.borderLight};
  vertical-align: top;
`;

export const TableRow = styled.tr`
  &:hover {
    background: ${tokens.colors.backgroundSecondary};
  }
`;

// Badge Component
export const Badge = styled.span<{ $variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'owner' | 'admin' | 'member' | 'public' | 'private' }>`
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.xs};
  font-weight: ${tokens.typography.fontWeights.medium};
  display: inline-block;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: #eef2ff;
          color: ${tokens.colors.primary};
          border: 1px solid #c7d2fe;
        `;
      case 'success':
        return `
          background: ${tokens.colors.successBackground};
          color: ${tokens.colors.success};
          border: 1px solid #a7f3d0;
        `;
      case 'warning':
        return `
          background: ${tokens.colors.warningBackground};
          color: ${tokens.colors.warning};
          border: 1px solid #fed7aa;
        `;
      case 'error':
        return `
          background: ${tokens.colors.errorBackground};
          color: ${tokens.colors.error};
          border: 1px solid #fecaca;
        `;
      case 'owner':
        return `
          background: #eef2ff;
          color: #3730a3;
          border: 1px solid #c7d2fe;
        `;
      case 'admin':
        return `
          background: #fffbeb;
          color: #92400e;
          border: 1px solid #fed7aa;
        `;
      case 'member':
        return `
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
        `;
      case 'public':
        return `
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        `;
      case 'private':
        return `
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        `;
      default:
        return `
          background: ${tokens.colors.backgroundSecondary};
          color: ${tokens.colors.textSecondary};
          border: 1px solid ${tokens.colors.borderLight};
        `;
    }
  }}
`;

// Message Components
export const Message = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.base};
  margin-bottom: ${tokens.spacing.lg};
  
  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          background: ${tokens.colors.successBackground};
          color: ${tokens.colors.success};
          border: 1px solid #a7f3d0;
        `;
      case 'error':
        return `
          background: ${tokens.colors.errorBackground};
          color: ${tokens.colors.error};
          border: 1px solid #fecaca;
        `;
      case 'warning':
        return `
          background: ${tokens.colors.warningBackground};
          color: ${tokens.colors.warning};
          border: 1px solid #fed7aa;
        `;
      case 'info':
        return `
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        `;
    }
  }}
`;

// Tab Components
export const TabContainer = styled.div`
  border-bottom: 1px solid ${tokens.colors.border};
  margin-bottom: ${tokens.spacing.xl};
`;

export const TabList = styled.div`
  display: flex;
  gap: ${tokens.spacing.lg};
`;

export const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: ${tokens.spacing.md} 0;
  font-size: ${tokens.typography.fontSizes.base};
  font-weight: ${tokens.typography.fontWeights.medium};
  color: ${({ $active }) => $active ? tokens.colors.primary : tokens.colors.textSecondary};
  border-bottom: 2px solid ${({ $active }) => $active ? tokens.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all ${tokens.transitions.base};
  
  &:hover {
    color: ${tokens.colors.primary};
  }
`;

export const TabContent = styled.div`
  min-height: 400px;
`;

// Section Components
export const Section = styled.div`
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.xl};
  margin-bottom: ${tokens.spacing.xl};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.lg};
`;

export const SectionTitle = styled.h3`
  font-size: ${tokens.typography.fontSizes.lg};
  font-weight: ${tokens.typography.fontWeights.semibold};
  color: ${tokens.colors.text};
  margin: 0;
`;

// Form Components
export const Form = styled.form`
  display: grid;
  gap: ${tokens.spacing.md};
`;

export const FormGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: ${({ $columns = 3 }) => `repeat(${$columns}, 1fr)`};
  gap: ${tokens.spacing.md};
  align-items: end;
  padding: ${tokens.spacing.lg};
  background: ${tokens.colors.backgroundSecondary};
  border-radius: ${tokens.borderRadius.base};
`;

// Grid Components
export const Grid = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ $gap }) => $gap || tokens.spacing.lg};
  
  ${({ $columns }) => $columns && `
    grid-template-columns: repeat(${$columns}, 1fr);
  `}
`;

// Stats Components
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${tokens.spacing.lg};
  margin-bottom: ${tokens.spacing.xl};
`;

export const StatCard = styled.div`
  background: ${tokens.colors.backgroundSecondary};
  padding: ${tokens.spacing.lg};
  border-radius: ${tokens.borderRadius.base};
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: ${tokens.typography.fontSizes['2xl']};
  font-weight: ${tokens.typography.fontWeights.bold};
  color: ${tokens.colors.text};
`;

export const StatLabel = styled.div`
  font-size: ${tokens.typography.fontSizes.sm};
  color: ${tokens.colors.textSecondary};
  margin-top: ${tokens.spacing.xs};
`;

// Modal Components
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${tokens.colors.background};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.xl};
  max-width: 500px;
  width: 90%;
  box-shadow: ${tokens.shadows.md};
`;

export const ModalTitle = styled.h2`
  margin: 0 0 ${tokens.spacing.lg} 0;
  color: ${tokens.colors.text};
  font-size: ${tokens.typography.fontSizes.xl};
  font-weight: ${tokens.typography.fontWeights.semibold};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${tokens.spacing.md};
  justify-content: flex-end;
  margin-top: ${tokens.spacing.xl};
`;

// Activity Components
export const ActivityItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: ${tokens.spacing.md};
  padding: ${tokens.spacing.md} 0;
  border-bottom: 1px solid ${tokens.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const ActivityLabel = styled.div`
  font-weight: ${tokens.typography.fontWeights.medium};
  color: ${tokens.colors.secondary};
`;

export const ActivityValue = styled.div`
  font-family: monospace;
  font-size: ${tokens.typography.fontSizes.sm};
  color: ${tokens.colors.text};
`;

// Loading & Empty States
export const EmptyState = styled.div`
  text-align: center;
  padding: ${tokens.spacing.xl};
  color: ${tokens.colors.textSecondary};
  font-style: italic;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: ${tokens.spacing.xl};
  color: ${tokens.colors.textSecondary};
`;

// Utility Components
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${tokens.colors.borderLight};
  margin: ${tokens.spacing.lg} 0;
`;

export const Spacer = styled.div<{ $size?: keyof typeof tokens.spacing }>`
  height: ${({ $size = 'md' }) => tokens.spacing[$size]};
`;

export const FlexRow = styled.div<{ $gap?: string; $justify?: string; $align?: string }>`
  display: flex;
  gap: ${({ $gap }) => $gap || tokens.spacing.sm};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  align-items: ${({ $align }) => $align || 'center'};
`;

export const FlexColumn = styled.div<{ $gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || tokens.spacing.sm};
`;
