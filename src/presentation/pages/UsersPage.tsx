import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { ResponsiveTable, CardGrid, StatCard } from '../components/ui/responsive';
import { useAuth } from '../hooks/useAuth';
import { userService, User } from '@/core/infrastructure/services/UserService';
import { UserRole, canManageRole, getManageableRoles, getRoleLabel, getRoleColor } from '@/core/domain/enums/roles';
import { Search, Plus, Trash2, UserCheck, UserX, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateUserModal } from '../components/features/CreateUserModal';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await userService.toggleActive(userId, !currentStatus);
      toast.success(currentStatus ? 'Usuario desactivado' : 'Usuario activado');
      loadUsers();
    } catch (error) {
      toast.error('Error al cambiar estado del usuario');
    }
  };

  const handleDelete = async (userId: string, userRole: UserRole) => {
    if (!currentUser?.role) return;
    
    if (!canManageRole(currentUser.role as UserRole, userRole)) {
      toast.error('No tienes permisos para eliminar este usuario');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await userService.delete(userId);
      toast.success('Usuario eliminado correctamente');
      loadUsers();
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const canManageUser = (targetRole: UserRole): boolean => {
    if (!currentUser?.role) return false;
    return canManageRole(currentUser.role as UserRole, targetRole);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Usuarios"
          description="Gestión de usuarios del sistema"
          breadcrumbs={[{ label: 'Usuarios' }]}
          actions={
            currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.ADMIN ? (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            ) : undefined
          }
        />

        {/* Stats - Responsive */}
        <CardGrid columns={4}>
          <StatCard
            label="Super Admins"
            value={users.filter(u => u.role === UserRole.SUPER_ADMIN).length}
            icon={Shield}
            color="purple"
          />
          <StatCard
            label="Admins"
            value={users.filter(u => u.role === UserRole.ADMIN).length}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Esteticistas"
            value={users.filter(u => u.role === UserRole.ESTETICISTA).length}
            icon={Users}
            color="green"
          />
          <StatCard
            label="Recepcionistas"
            value={users.filter(u => u.role === UserRole.RECEPCIONISTA).length}
            icon={Users}
            color="gold"
          />
        </CardGrid>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-4 py-2 bg-dark-800 border border-dark-700 text-white rounded-lg focus:ring-2 focus:ring-gold-500"
          >
            <option value="all">Todos los roles</option>
            <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.ESTETICISTA}>Esteticista</option>
            <option value={UserRole.RECEPCIONISTA}>Recepcionista</option>
          </select>
        </div>

        {/* Users Table - Responsive */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-dark-300">Cargando usuarios...</p>
          </div>
        ) : (
          <ResponsiveTable
            data={filteredUsers}
            columns={[
              {
                header: 'Usuario',
                accessor: (user) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.displayName}</div>
                      {user.phoneNumber && (
                        <div className="text-sm text-dark-400">{user.phoneNumber}</div>
                      )}
                    </div>
                  </div>
                ),
                mobileLabel: 'Usuario'
              },
              {
                header: 'Email',
                accessor: 'email',
                mobileLabel: 'Email'
              },
              {
                header: 'Rol',
                accessor: (user) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                ),
                mobileLabel: 'Rol'
              },
              {
                header: 'Estado',
                accessor: (user) => (
                  user.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                      Inactivo
                    </span>
                  )
                ),
                mobileLabel: 'Estado'
              },
              {
                header: 'Acciones',
                accessor: (user) => (
                  <div className="flex items-center justify-end gap-2">
                    {canManageUser(user.role) ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(user.id, user.isActive);
                          }}
                          className="p-2 text-dark-400 hover:text-white hover:bg-dark-600 rounded transition-colors"
                          title={user.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id, user.role);
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-dark-500">Sin permisos</span>
                    )}
                  </div>
                ),
                mobileLabel: 'Acciones',
                className: 'text-right'
              }
            ]}
            keyExtractor={(user) => user.id}
            emptyMessage={
              searchTerm || roleFilter !== 'all' 
                ? 'No se encontraron usuarios' 
                : 'No hay usuarios registrados'
            }
          />
        )}

        {/* Modal Crear Usuario */}
        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={loadUsers}
          />
        )}

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>Nota:</strong> {currentUser?.role === UserRole.SUPER_ADMIN 
              ? 'Como SUPER_ADMIN puedes gestionar todos los usuarios del sistema.'
              : 'Como ADMIN solo puedes gestionar Esteticistas y Recepcionistas.'}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
