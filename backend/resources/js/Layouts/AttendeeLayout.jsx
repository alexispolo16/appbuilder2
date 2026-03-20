import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import { useAuth } from '@/hooks/useAuth';
import { useActiveUrl } from '@/hooks/useActiveUrl';
import { useIsMobile } from '@/hooks/useIsMobile';
import FlashNotifications from '@/Components/FlashNotifications';

export default function AttendeeLayout({ children, event }) {
    const { user } = useAuth();
    const { isActive } = useActiveUrl();
    const isMobile = useIsMobile();
    const [navOpen, setNavOpen] = useState(!isMobile);
    const { portalMeta } = usePage().props;
    const isSpeaker = portalMeta?.ticket_type === 'speaker';

    const navItems = [
        { type: 'link', text: 'Mis Eventos', href: '/portal' },
        { type: 'link', text: 'Mi Perfil', href: '/portal/profile' },
    ];

    if (event) {
        const prefix = `/portal/events/${event.id}`;

        if (isSpeaker) {
            navItems.push(
                { type: 'divider' },
                { type: 'link', text: 'Speaker Dashboard', href: `${prefix}/speaker-dashboard` },
            );
        }

        navItems.push(
            { type: 'divider' },
            { type: 'link', text: 'Mi Entrada', href: `${prefix}/ticket` },
            { type: 'link', text: 'Agenda', href: `${prefix}/agenda` },
            { type: 'link', text: 'Speakers', href: `${prefix}/speakers` },
            { type: 'link', text: 'Sponsors', href: `${prefix}/sponsors` },
            { type: 'divider' },
            { type: 'link', text: 'Networking', href: `${prefix}/networking` },
            { type: 'link', text: 'Directorio', href: `${prefix}/directory` },
            { type: 'link', text: 'Mis Contactos', href: `${prefix}/contacts` },
            { type: 'divider' },
            { type: 'link', text: 'Encuestas', href: `${prefix}/surveys` },
            { type: 'link', text: 'Anuncios', href: `${prefix}/announcements` },
            { type: 'link', text: 'Mis Insignias', href: `${prefix}/badges` },
        );

        if (portalMeta?.certificate_available) {
            navItems.push(
                { type: 'link', text: 'Mi Certificado', href: `${prefix}/certificate/download` },
            );
        }
    }

    function handleNavFollow(e) {
        e.preventDefault();
        router.visit(e.detail.href);
    }

    function logout() {
        router.post('/logout');
    }

    const userMenuItems = [
        { id: 'profile', text: 'Mi Perfil', href: '/portal/profile' },
        { id: 'logout', text: 'Cerrar sesion' },
    ];

    function handleUtilityClick(e) {
        if (e.detail.id === 'profile') {
            router.visit('/portal/profile');
        } else if (e.detail.id === 'logout') {
            logout();
        }
    }

    const activeHref = navItems.find((i) => i.href && isActive(i.href))?.href || '/portal';

    return (
        <>
            <div id="top-nav">
                <TopNavigation
                    identity={{
                        href: '/portal',
                        title: 'BuilderApp',
                        onFollow: (e) => {
                            e.preventDefault();
                            router.visit('/portal');
                        },
                    }}
                    utilities={[
                        {
                            type: 'menu-dropdown',
                            text: user ? `${user.first_name} ${user.last_name}` : '',
                            description: user?.email || '',
                            iconName: 'user-profile',
                            items: userMenuItems,
                            onItemClick: handleUtilityClick,
                        },
                    ]}
                />
            </div>
            <AppLayout
                navigation={
                    <SideNavigation
                        header={{
                            text: event?.name || 'Portal del Asistente',
                            href: '/portal',
                        }}
                        activeHref={activeHref}
                        items={navItems}
                        onFollow={handleNavFollow}
                    />
                }
                navigationOpen={navOpen}
                onNavigationChange={({ detail }) => setNavOpen(detail.open)}
                toolsHide={true}
                notifications={<FlashNotifications />}
                content={children}
                headerSelector="#top-nav"
                stickyNotifications
            />
        </>
    );
}
