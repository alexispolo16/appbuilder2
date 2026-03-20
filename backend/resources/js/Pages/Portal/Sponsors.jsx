import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';

export default function Sponsors({ event, sponsors, sponsorLevels }) {
    const grouped = sponsorLevels
        .map((level) => ({ ...level, sponsors: sponsors.filter((s) => s.sponsor_level?.id === level.id) }))
        .filter((g) => g.sponsors.length > 0);

    const ungrouped = sponsors.filter((s) => !s.sponsor_level);

    return (
        <AttendeeLayout event={event}>
            <Head title={`Sponsors - ${event.name}`} />
            <ContentLayout
                header={
                    <Header variant="h1" description={event.name} counter={`(${sponsors.length})`}>
                        Sponsors
                    </Header>
                }
            >
                <SpaceBetween size="l">
                    {sponsors.length === 0 && (
                        <Container>
                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                No hay sponsors para este evento.
                            </Box>
                        </Container>
                    )}

                    {grouped.map((group) => (
                        <Cards
                            key={group.id}
                            header={<Header variant="h2">{group.name}</Header>}
                            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 800, cards: 3 }]}
                            cardDefinition={{
                                header: (item) => (
                                    <Box fontWeight="bold" textAlign="center">
                                        {item.company_name}
                                    </Box>
                                ),
                                sections: [
                                    {
                                        id: 'logo',
                                        content: (item) =>
                                            item.logo_url ? (
                                                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                                                    <img
                                                        src={item.logo_url}
                                                        alt={item.company_name}
                                                        style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }}
                                                    />
                                                </div>
                                            ) : null,
                                    },
                                    {
                                        id: 'description',
                                        content: (item) =>
                                            item.description ? (
                                                <Box color="text-body-secondary" fontSize="body-s" textAlign="center">
                                                    {item.description}
                                                </Box>
                                            ) : null,
                                    },
                                    {
                                        id: 'website',
                                        content: (item) =>
                                            item.website ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <Link href={item.website} external fontSize="body-s">
                                                        Visitar sitio web →
                                                    </Link>
                                                </div>
                                            ) : null,
                                    },
                                ],
                            }}
                            items={group.sponsors}
                        />
                    ))}

                    {ungrouped.length > 0 && (
                        <Cards
                            header={<Header variant="h2">Otros sponsors</Header>}
                            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 800, cards: 3 }]}
                            cardDefinition={{
                                header: (item) => (
                                    <Box fontWeight="bold" textAlign="center">
                                        {item.company_name}
                                    </Box>
                                ),
                                sections: [
                                    {
                                        id: 'logo',
                                        content: (item) =>
                                            item.logo_url ? (
                                                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                                                    <img
                                                        src={item.logo_url}
                                                        alt={item.company_name}
                                                        style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }}
                                                    />
                                                </div>
                                            ) : null,
                                    },
                                    {
                                        id: 'website',
                                        content: (item) =>
                                            item.website ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <Link href={item.website} external fontSize="body-s">
                                                        Visitar sitio web →
                                                    </Link>
                                                </div>
                                            ) : null,
                                    },
                                ],
                            }}
                            items={ungrouped}
                        />
                    )}
                </SpaceBetween>
            </ContentLayout>
        </AttendeeLayout>
    );
}
