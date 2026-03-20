import { formatEventDateRange } from '@/utils/formatters';

const DEFAULT_DESIGN = {
    header_bg_start: '#0972d3',
    header_bg_end: '#033160',
    header_label: 'ENTRADA DIGITAL',
    accent_color: '#0972d3',
    bg_color: '#f0f2f5',
    text_primary: '#16191f',
    text_secondary: '#9ba7b6',
    show_company: false,
    show_job_title: false,
    show_sponsors: false,
};

export function getDesign(credentialDesign) {
    return { ...DEFAULT_DESIGN, ...(credentialDesign || {}) };
}

function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxWidth && line) {
            ctx.fillText(line.trim(), x, currentY);
            line = word + ' ';
            currentY += lineHeight;
        } else {
            line = test;
        }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY;
}

function loadImg(src) {
    return new Promise((res) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
    });
}

export function generateTicketImage(qrSvgElement, event, participant, credentialDesign, sponsors = []) {
    const d = getDesign(credentialDesign);

    const sponsorLogos = d.show_sponsors
        ? (sponsors || []).filter(s => s.logo_url).map(s => s.logo_url).slice(0, 6)
        : [];

    const svgData = new XMLSerializer().serializeToString(qrSvgElement);
    const qrSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    return Promise.all([
        loadImg(qrSrc),
        ...sponsorLogos.map(loadImg),
    ]).then(([qrImg, ...loadedLogos]) => {
        if (!qrImg) return null;
        const validLogos = loadedLogos.filter(Boolean);

        const scale = 2;
        const W = 480 * scale;
        const sponsorSectionH = validLogos.length > 0 ? 90 * scale : 0;
        const H = 820 * scale + sponsorSectionH;
        const pad = 40 * scale;

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = d.bg_color;
        ctx.fillRect(0, 0, W, H);

        // Card shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 24 * scale;
        ctx.shadowOffsetY = 4 * scale;
        drawRoundedRect(ctx, 16 * scale, 16 * scale, W - 32 * scale, H - 32 * scale, 24 * scale);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();

        const innerX = 16 * scale;
        const innerW = W - 32 * scale;
        const innerR = 24 * scale;

        // Header gradient
        const headerH = 160 * scale;
        ctx.save();
        drawRoundedRect(ctx, innerX, 16 * scale, innerW, headerH, innerR);
        ctx.rect(innerX, 16 * scale + innerR, innerW, headerH);
        ctx.clip();
        drawRoundedRect(ctx, innerX, 16 * scale, innerW, headerH, innerR);
        const grad = ctx.createLinearGradient(innerX, 16 * scale, innerX + innerW, 16 * scale + headerH);
        grad.addColorStop(0, d.header_bg_start);
        grad.addColorStop(1, d.header_bg_end);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        // Header text
        let ty = 16 * scale + 36 * scale;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = `bold ${11 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(d.header_label, W / 2, ty);

        ty += 28 * scale;
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${20 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        const lastY = wrapText(ctx, event.name, W / 2, ty, innerW - pad * 2, 26 * scale);

        ty = lastY + 22 * scale;
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = `500 ${11 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        if (event.date_start) {
            wrapText(ctx, formatEventDateRange(event.date_start, event.date_end), W / 2, ty, innerW - pad * 2, 16 * scale);
            ty += 18 * scale;
        }
        if (event.venue || event.location) {
            wrapText(ctx, [event.venue, event.location].filter(Boolean).join(', '), W / 2, ty, innerW - pad * 2, 16 * scale);
        }

        // Tear line
        const tearY = 16 * scale + headerH;
        const circleR = 14 * scale;
        ctx.fillStyle = d.bg_color;
        ctx.beginPath(); ctx.arc(innerX, tearY, circleR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(innerX + innerW, tearY, circleR, 0, Math.PI * 2); ctx.fill();

        ctx.save();
        ctx.strokeStyle = '#dde1e6';
        ctx.lineWidth = 1.5 * scale;
        ctx.setLineDash([6 * scale, 4 * scale]);
        ctx.beginPath();
        ctx.moveTo(innerX + circleR + 4 * scale, tearY);
        ctx.lineTo(innerX + innerW - circleR - 4 * scale, tearY);
        ctx.stroke();
        ctx.restore();

        // Participant info
        ctx.textAlign = 'left';
        let infoY = tearY + 32 * scale;
        const infoX = innerX + pad;

        function drawField(label, value, yPos, small) {
            ctx.fillStyle = d.text_secondary;
            ctx.font = `600 ${9 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            ctx.fillText(label.toUpperCase(), infoX, yPos);
            ctx.fillStyle = d.text_primary;
            ctx.font = `${small ? 500 : 600} ${(small ? 12 : 14) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            ctx.fillText(value, infoX, yPos + 18 * scale);
            return yPos + 44 * scale;
        }

        infoY = drawField('Nombre completo', participant.full_name, infoY, false);
        infoY = drawField('Correo electronico', participant.email, infoY, true);

        if (d.show_company && participant.company) {
            infoY = drawField('Empresa', participant.company, infoY, true);
        }
        if (d.show_job_title && participant.job_title) {
            infoY = drawField('Cargo', participant.job_title, infoY, true);
        }

        // Registration code
        infoY += 4 * scale;
        ctx.fillStyle = d.text_secondary;
        ctx.font = `600 ${9 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('CODIGO DE REGISTRO', W / 2, infoY);
        infoY += 24 * scale;
        ctx.fillStyle = d.accent_color;
        ctx.font = `bold ${26 * scale}px 'SF Mono', 'Fira Code', Consolas, monospace`;
        ctx.fillText(participant.registration_code, W / 2, infoY);

        // QR Code
        infoY += 28 * scale;
        const qrSize = 200 * scale;
        const qrX = (W - qrSize) / 2;

        drawRoundedRect(ctx, qrX - 8 * scale, infoY - 8 * scale, qrSize + 16 * scale, qrSize + 16 * scale, 12 * scale);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#e9ebed';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();

        ctx.drawImage(qrImg, qrX, infoY, qrSize, qrSize);

        infoY += qrSize + 20 * scale;
        ctx.fillStyle = d.text_secondary;
        ctx.font = `500 ${10 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('Presenta este codigo en la entrada del evento', W / 2, infoY);

        // Sponsor logos
        if (validLogos.length > 0) {
            infoY += 28 * scale;

            ctx.fillStyle = d.text_secondary;
            ctx.font = `600 ${8 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('SPONSORS', W / 2, infoY);

            infoY += 16 * scale;

            const maxLogoH = 36 * scale;
            const logoGap = 20 * scale;
            const maxRowW = innerW - pad * 2;

            const scaledLogos = validLogos.map(img => {
                const ratio = img.width / img.height;
                const h = Math.min(maxLogoH, img.height);
                const w = h * ratio;
                return { img, w, h };
            });

            let totalW = scaledLogos.reduce((sum, l) => sum + l.w, 0) + (scaledLogos.length - 1) * logoGap;

            if (totalW > maxRowW) {
                const factor = maxRowW / totalW;
                for (const l of scaledLogos) {
                    l.w *= factor;
                    l.h *= factor;
                }
                totalW = maxRowW;
            }

            let logoX = (W - totalW) / 2;
            for (const { img, w, h } of scaledLogos) {
                const logoY = infoY + (maxLogoH - h) / 2;
                ctx.drawImage(img, logoX, logoY, w, h);
                logoX += w + logoGap;
            }
        }

        // Footer
        const footerY = H - 16 * scale - 36 * scale;
        ctx.strokeStyle = '#d5dbdb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(innerX + pad, footerY);
        ctx.lineTo(innerX + innerW - pad, footerY);
        ctx.stroke();

        ctx.fillStyle = '#b8bfc7';
        ctx.font = `500 ${9 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('Generado por BuilderApp', W / 2, footerY + 20 * scale);

        return canvas.toDataURL('image/png');
    });
}
