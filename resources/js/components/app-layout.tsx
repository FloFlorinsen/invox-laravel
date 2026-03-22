import { router, useForm, usePage } from '@inertiajs/react';
import { Button, Description, Drawer, Label, ListBox } from '@heroui/react';
import { type Key, type ReactNode, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import UserAvatar from '@/components/user-avatar';
import {
    IconContacts,
    IconExpenses,
    IconHome,
    IconLogout,
    IconMenu,
    IconReceipt,
} from '@/icons';
import { logout } from '@/routes';
import { index as contactsIndex } from '@/routes/contacts';
import { index as expensesIndex } from '@/routes/expenses';
import { index as invoicesIndex } from '@/routes/invoices';

const NAV_ITEMS = [
    { id: '/', label: 'EÜR', icon: IconHome },
    { id: '/invoices', label: 'Rechnungen', icon: IconReceipt },
    { id: '/expenses', label: 'Ausgaben', icon: IconExpenses },
    { id: '/contacts', label: 'Kontakte', icon: IconContacts },
] as const;

interface Props {
    children: ReactNode;
}

export default function AppLayout({ children }: Props) {
    const { auth } = usePage().props;
    const logoutForm = useForm({});
    const url = usePage().url;
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logoutForm.post(logout.url());
    };

    const isActive = (path: string) =>
        path === '/' ? url === '/' : url.startsWith(path);

    const handleNavigate = (key: Key) => {
        const href = (() => {
            switch (key) {
                case '/invoices':
                    return invoicesIndex.url();
                case '/expenses':
                    return expensesIndex.url();
                case '/contacts':
                    return contactsIndex.url();
                default:
                    return '/';
            }
        })();
        setDrawerOpen(false);
        router.visit(href);
    };

    const navContent = (
        <>
            <nav className="flex-1">
                <ListBox aria-label="Navigation" onAction={handleNavigate}>
                    {NAV_ITEMS.map((item) => (
                        <ListBox.Item
                            key={item.id}
                            id={item.id}
                            textValue={item.label}
                            data-active={isActive(item.id) || undefined}
                            className="data-active:bg-default"
                        >
                            <item.icon className="size-5 text-muted" />
                            <Label>{item.label}</Label>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </nav>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        user={auth.user}
                        color="accent"
                        variant="soft"
                    />
                    <div className="flex flex-col">
                        <Label>{auth.user.name}</Label>
                        <Description>{auth.user.email}</Description>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start"
                >
                    <IconLogout />
                    Abmelden
                </Button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-background antialiased lg:py-8">
            {/* Desktop sidebar */}
            <aside className="hidden w-90 flex-col gap-8 border-e border-separator px-8 py-5 lg:flex">
                <AppLogoIcon className="ms-1 h-7 self-start" />
                {navContent}
            </aside>

            {/* Mobile header + drawer */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex items-center gap-3 border-b border-separator px-4 py-3 lg:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        aria-label="Navigation öffnen"
                        onPress={() => setDrawerOpen(true)}
                    >
                        <IconMenu className="size-5" />
                    </Button>
                    <AppLogoIcon className="h-6" />
                </header>

                <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen}>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left" className="w-80">
                            <Drawer.Dialog>
                                <Drawer.Header>
                                    <AppLogoIcon className="h-7" />
                                </Drawer.Header>
                                <Drawer.Body className="flex flex-col gap-8">
                                    {navContent}
                                </Drawer.Body>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>

                <main className="flex-1 overflow-auto px-4 py-5 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
