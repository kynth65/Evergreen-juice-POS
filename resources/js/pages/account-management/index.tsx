import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { UserPlus, Edit, Trash2, Users } from 'lucide-react';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    cashiers: User[];
}

export default function AccountManagementIndex({ cashiers }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        is_active: true,
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/account-management', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateDialogOpen(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(`/account-management/${editingUser.id}`, {
            onSuccess: () => {
                editForm.reset();
                setEditingUser(null);
            },
        });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/account-management/${user.id}`);
        }
    };

    const openEditDialog = (user: User) => {
        editForm.setData({
            name: user.name,
            email: user.email,
            is_active: user.is_active,
        });
        setEditingUser(user);
    };

    return (
        <>
            <Head title="Account Management" />

            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Account Management</h1>
                        <p className="text-gray-600 mt-2">Manage cashier accounts</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Cashier
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Cashier Account</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="create-name">Name</Label>
                                    <Input
                                        id="create-name"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{createForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="create-email">Email</Label>
                                    <Input
                                        id="create-email"
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{createForm.errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="create-password">Password</Label>
                                    <Input
                                        id="create-password"
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) => createForm.setData('password', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{createForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="create-password-confirmation">Confirm Password</Label>
                                    <Input
                                        id="create-password-confirmation"
                                        type="password"
                                        value={createForm.data.password_confirmation}
                                        onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing}>
                                        {createForm.processing ? 'Creating...' : 'Create Account'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Cashier Accounts ({cashiers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cashiers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No cashier accounts found</p>
                                <p className="text-sm text-gray-500 mt-2">Create your first cashier account to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2">Name</th>
                                            <th className="text-left py-3 px-2">Email</th>
                                            <th className="text-left py-3 px-2">Status</th>
                                            <th className="text-left py-3 px-2">Created</th>
                                            <th className="text-right py-3 px-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cashiers.map((cashier) => (
                                            <tr key={cashier.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-2 font-medium">{cashier.name}</td>
                                                <td className="py-3 px-2 text-gray-600">{cashier.email}</td>
                                                <td className="py-3 px-2">
                                                    <Badge variant={cashier.is_active ? "default" : "secondary"}>
                                                        {cashier.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-2 text-gray-600">
                                                    {new Date(cashier.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(cashier)}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDelete(cashier)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Cashier Account</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{editForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    required
                                />
                                {editForm.errors.email && (
                                    <p className="text-sm text-red-600 mt-1">{editForm.errors.email}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-active"
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(checked: boolean) => editForm.setData('is_active', checked)}
                                />
                                <Label htmlFor="edit-active">Active Account</Label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Updating...' : 'Update Account'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}