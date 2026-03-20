import { Link } from '@inertiajs/react';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import StatusBadge from '@/Components/StatusBadge';
import { formatEventDateRange } from '@/utils/formatters';

export default function EventCard({ event }) {
    return (
        <Link href={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Container>
                <SpaceBetween size="s">
                    {event.event_image_url && (
                        <img
                            src={event.event_image_url}
                            alt={event.name}
                            style={{
                                width: '100%',
                                height: 160,
                                objectFit: 'cover',
                                borderRadius: 8,
                                display: 'block',
                            }}
                        />
                    )}
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                        <Box variant="h3" margin={{ bottom: 'n' }}>
                            {event.name}
                        </Box>
                        <StatusBadge status={event.status} />
                    </SpaceBetween>
                    {event.description && (() => {
                        const text = event.description.replace(/<[^>]*>/g, '');
                        return text ? (
                            <Box variant="p" color="text-body-secondary">
                                {text.length > 100 ? text.substring(0, 100) + '...' : text}
                            </Box>
                        ) : null;
                    })()}
                    <SpaceBetween size="xxs">
                        <Box variant="small" color="text-body-secondary">
                            {formatEventDateRange(event.date_start, event.date_end)}
                        </Box>
                        {(event.location || event.venue) && (
                            <Box variant="small" color="text-body-secondary">
                                {event.venue || event.location}
                            </Box>
                        )}
                        {event.capacity && (
                            <Box variant="small" color="text-body-secondary">
                                {event.capacity} personas
                            </Box>
                        )}
                    </SpaceBetween>
                </SpaceBetween>
            </Container>
        </Link>
    );
}
