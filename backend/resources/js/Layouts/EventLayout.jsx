import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Tabs from '@cloudscape-design/components/tabs';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusBadge from '@/Components/StatusBadge';
import { formatEventDateRange } from '@/utils/formatters';

export default function EventLayout({ event, actions, children }) {
    const { url } = usePage();

    const tabItems = [
        { id: 'general', label: 'General', href: `/events/${event.id}` },
        { id: 'participants', label: 'Participantes', href: `/events/${event.id}/participants` },
        { id: 'speakers', label: 'Speakers', href: `/events/${event.id}/speakers` },
        { id: 'cfp', label: 'Convocatoria', href: `/events/${event.id}/cfp` },
        { id: 'sponsors', label: 'Sponsors', href: `/events/${event.id}/sponsors` },
        { id: 'communities', label: 'Comunidades', href: `/events/${event.id}/communities` },
        { id: 'agenda', label: 'Agenda', href: `/events/${event.id}/agenda` },
        { id: 'communications', label: 'Comunicaciones', href: `/events/${event.id}/communications` },
        { id: 'surveys', label: 'Encuestas', href: `/events/${event.id}/surveys` },
        { id: 'scanner', label: 'Scanner', href: `/events/${event.id}/scanner` },
        { id: 'badges', label: 'Insignias', href: `/events/${event.id}/badges` },
        { id: 'attendance', label: 'Asistencia', href: `/events/${event.id}/attendance` },
        { id: 'certificates', label: 'Certificados', href: `/events/${event.id}/certificates` },
        { id: 'reports', label: 'Reportes', href: `/events/${event.id}/scanner/reports` },
    ];

    function getActiveTab() {
        const cleanUrl = url.split('?')[0];
        // Sort by href length descending so more specific routes match first
        // (e.g. /scanner/reports before /scanner)
        const sorted = [...tabItems].sort((a, b) => b.href.length - a.href.length);
        for (const tab of sorted) {
            if (tab.id === 'general') {
                if (cleanUrl === tab.href || cleanUrl === tab.href + '/') return tab.id;
            } else {
                if (cleanUrl.startsWith(tab.href)) return tab.id;
            }
        }
        return 'general';
    }

    function handleTabChange({ detail }) {
        const tab = tabItems.find((t) => t.id === detail.activeTabId);
        if (tab) router.visit(tab.href);
    }

    const description = [
        formatEventDateRange(event.date_start, event.date_end),
        event.location,
        event.venue,
    ].filter(Boolean).join(' · ');

    return (
        <AuthenticatedLayout>
            <SpaceBetween size="l">
                <BreadcrumbGroup
                    items={[
                        { text: 'Eventos', href: '/events' },
                        { text: event.name, href: `/events/${event.id}` },
                    ]}
                    onFollow={(e) => {
                        e.preventDefault();
                        router.visit(e.detail.href);
                    }}
                />
                <Header
                    variant="h1"
                    description={description}
                    info={<StatusBadge status={event.status} />}
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            {actions}
                            <Button
                                variant="primary"
                                iconName="search"
                                onClick={() => router.visit(`/events/${event.id}/scanner`)}
                            >
                                Escanear
                            </Button>
                        </SpaceBetween>
                    }
                >
                    {event.name}
                </Header>
                <div className="event-tabs-scroll">
                    <Tabs
                        activeTabId={getActiveTab()}
                        onChange={handleTabChange}
                        tabs={tabItems}
                    />
                </div>
                {children}
            </SpaceBetween>
        </AuthenticatedLayout>
    );
}
