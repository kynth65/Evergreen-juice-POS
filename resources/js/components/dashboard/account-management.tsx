import { router, useForm } from '@inertiajs/react';
import { Edit, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

interface User {
    id: number;
    name: string;
    email?: string;
    is_active?: boolean;
    created_at?: string;
}

interface Props {
    users: User[];
}

export function AccountManagement({ users }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
    });

    const editForm = useForm({
        name: '',
        email: '',
        is_active: true,
        role: 'cashier',
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

    const handleDelete = () => {
        if (!deletingUser) return;

        router.delete(`/account-management/${deletingUser.id}`, {
            onSuccess: () => {
                setDeletingUser(null);
            },
        });
    };

    const openEditDialog = (user: User) => {
        editForm.setData({
            name: user.name,
            email: user.email || '',
            is_active: user.is_active || false,
            role: user.role,
        });
        setEditingUser(user);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Create New User Account
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={handleCreateSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="create-name">Name</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="create-email">Email</Label>
                                <Input
                                    id="create-email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="create-role">Role</Label>
                                <Select
                                    value={createForm.data.role}
                                    onValueChange={(value) =>
                                        createForm.setData('role', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="cashier">Cashier</SelectItem>
                                    </SelectContent>
                                </Select>
                                {createForm.errors.role && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.role}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="create-password">
                                    Password
                                </Label>
                                <Input
                                    id="create-password"
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="create-password-confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="create-password-confirmation"
                                    type="password"
                                    value={
                                        createForm.data.password_confirmation
                                    }
                                    onChange={(e) =>
                                        createForm.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                >
                                    {createForm.processing
                                        ? 'Creating...'
                                        : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Accounts ({users.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p className="text-gray-600">
                                No user accounts found
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Create your first user account to get started
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-[600px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {user.role === 'admin' ? 'Admin' : 'Cashier'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        (user.is_active ??
                                                        true)
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {(user.is_active ?? true)
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.created_at
                                                    ? new Date(
                                                          user.created_at,
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openEditDialog(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setDeletingUser(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                required
                            />
                            {editForm.errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {editForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                                required
                            />
                            {editForm.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {editForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(value) =>
                                    editForm.setData('role', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="cashier">Cashier</SelectItem>
                                </SelectContent>
                            </Select>
                            {editForm.errors.role && (
                                <p className="mt-1 text-sm text-red-600">
                                    {editForm.errors.role}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="edit-active"
                                checked={editForm.data.is_active}
                                onCheckedChange={(checked: boolean) =>
                                    editForm.setData('is_active', checked)
                                }
                            />
                            <Label htmlFor="edit-active">Active Account</Label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? 'Updating...'
                                    : 'Update Account'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingUser}
                onOpenChange={(open) => !open && setDeletingUser(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-black">
                            Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-700">
                            This will permanently delete the user account for{' '}
                            <strong>{deletingUser?.name}</strong>. This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
