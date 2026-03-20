import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';

const AVATAR_COLORS = ['#0972d3', '#037f0c', '#7d2105', '#8900e1', '#033160'];

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function avatarColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function SpeakerAvatar({ speaker }) {
    return (
        <div
            className="portal-avatar portal-avatar--lg"
            style={speaker.photo_url ? {} : { background: avatarColor(speaker.full_name) }}
        >
            {speaker.photo_url
                ? <img src={speaker.photo_url} alt={speaker.full_name} />
                : getInitials(speaker.full_name)}
        </div>
    );
}

const SOCIAL_ICONS = {
    linkedin: '🔗',
    github: '💻',
    instagram: '📸',
    website: '🌐',
    twitter: '🐦',
};

export default function Speakers({ event, speakers }) {
    return (
        <AttendeeLayout event={event}>
            <Head title={`Speakers - ${event.name}`} />
            <ContentLayout
                header={
                    <Header variant="h1" description={event.name} counter={`(${speakers.length})`}>
                        Speakers
                    </Header>
                }
            >
                <Cards
                    cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 860, cards: 3 }]}
                    cardDefinition={{
                        header: (item) => (
                            <SpaceBetween direction="horizontal" size="m" alignItems="center">
                                <SpeakerAvatar speaker={item} />
                                <div>
                                    <Box fontWeight="bold" fontSize="body-l">{item.full_name}</Box>
                                    {item.job_title && (
                                        <Box color="text-body-secondary" fontSize="body-s">{item.job_title}</Box>
                                    )}
                                    {item.company && (
                                        <Box fontSize="body-s" fontWeight="bold" color="text-status-info">
                                            {item.company}
                                        </Box>
                                    )}
                                </div>
                            </SpaceBetween>
                        ),
                        sections: [
                            {
                                id: 'bio',
                                content: (item) =>
                                    item.bio ? (
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {item.bio}
                                        </Box>
                                    ) : null,
                            },
                            {
                                id: 'social',
                                content: (item) => {
                                    const entries = Object.entries(item.social_links || {}).filter(([, v]) => v);
                                    if (!entries.length) return null;
                                    return (
                                        <SpaceBetween direction="horizontal" size="xs">
                                            {entries.map(([key, url]) => (
                                                <Link key={key} href={url} external fontSize="body-s">
                                                    {SOCIAL_ICONS[key] || '🔗'} {key}
                                                </Link>
                                            ))}
                                        </SpaceBetween>
                                    );
                                },
                            },
                        ],
                    }}
                    items={speakers}
                    empty={
                        <Box textAlign="center" padding="l" color="text-body-secondary">
                            No hay speakers confirmados para este evento.
                        </Box>
                    }
                />
            </ContentLayout>
        </AttendeeLayout>
    );
}
