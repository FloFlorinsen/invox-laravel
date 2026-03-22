import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import { FC } from 'react';

import { Invoice } from '@/types';
import { formatDate } from '@/utils/format-date';
import { formatMoney } from '@/utils/format-money';
import {
    PdfTable,
    PdfTableBodyCell,
    PdfTableHeader,
    PdfTableHeaderCell,
    PdfTableRow,
} from '@/components/pdf/pdf-table';

const basePath = import.meta.env.VITE_BASE_PATH || ''

Font.register({
    family: 'Geist',
    fonts: [
        { src: `${basePath}/Geist-Regular.otf`, fontWeight: 400 },
        { src: `${basePath}/Geist-Medium.otf`, fontWeight: 500 },
        { src: `${basePath}/Geist-SemiBold.otf`, fontWeight: 600 },
    ],
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        fontSize: 11,
        fontFamily: 'Geist',
        lineHeight: 1.27,
        letterSpacing: 11 * -0.025,
    },
});

export const InvoicePdf: FC<{ invoice: Invoice }> = ({ invoice }) => {
    const price = formatMoney(
        invoice.items.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0,
        ),
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View
                    style={{
                        paddingHorizontal: 36,
                        paddingVertical: 32,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ flex: 1, width: '100%' }}>
                        <Text
                            style={{
                                fontWeight: 600,
                                letterSpacing: 20 * -0.05,
                                fontSize: 20,
                                lineHeight: 1,
                            }}
                        >
                            Florian Münch
                        </Text>
                        <View
                            style={{
                                marginTop: 8,
                                fontSize: 9,
                                letterSpacing: 9 * -0.025,
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 4,
                                fontWeight: 500,
                                borderBottom: '0.5px solid #000000',
                                lineHeight: 1.3,
                            }}
                        >
                            <Text>Kaitzer Straße 30</Text>
                            <Text>•</Text>
                            <Text>01069 Dresden</Text>
                            <Text>•</Text>
                            <Text>St-Nr.: 203/251/04156</Text>
                        </View>

                        <View style={{ marginTop: 42 }}>
                            <Text>{invoice.contact.name}</Text>
                            {invoice.contact.address_lines.map((line) => (
                                <Text key={line}>{line}</Text>
                            ))}
                        </View>

                        <Text
                            style={{
                                textTransform: 'uppercase',
                                marginTop: 83,
                                letterSpacing: 40 * -0.05,
                                fontWeight: 600,
                                fontSize: 40,
                                lineHeight: 1,
                                marginLeft: -2.5,
                            }}
                        >
                            Rechnung
                        </Text>

                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 4,
                                width: '100%',
                                fontSize: 16,
                                letterSpacing: 16 * -0.05,
                                fontWeight: 600,
                            }}
                        >
                            <Text>Nr. {invoice.number}</Text>
                            <Text>{formatDate(invoice.date)}</Text>
                        </View>

                        <View style={{ marginTop: 42 }}>
                            <PdfTable>
                                <PdfTableHeader>
                                    <PdfTableHeaderCell width={'100%'} flex={1}>
                                        Bezeichnung
                                    </PdfTableHeaderCell>
                                    <PdfTableHeaderCell
                                        width={60}
                                        textAlign="center"
                                    >
                                        Menge
                                    </PdfTableHeaderCell>
                                    <PdfTableHeaderCell
                                        width={100}
                                        textAlign="right"
                                    >
                                        Einzelpreis
                                    </PdfTableHeaderCell>
                                    <PdfTableHeaderCell
                                        width={100}
                                        textAlign="right"
                                    >
                                        Gesamtpreis
                                    </PdfTableHeaderCell>
                                </PdfTableHeader>

                                {invoice.items.map((item) => (
                                    <PdfTableRow key={item.name}>
                                        <PdfTableBodyCell
                                            flex={1}
                                            width={'100%'}
                                        >
                                            {item.name}
                                        </PdfTableBodyCell>
                                        <PdfTableBodyCell
                                            width={60}
                                            textAlign="center"
                                        >
                                            {item.quantity}
                                        </PdfTableBodyCell>
                                        <PdfTableBodyCell
                                            width={100}
                                            textAlign="right"
                                        >
                                            {formatMoney(Number(item.price))}
                                        </PdfTableBodyCell>
                                        <PdfTableBodyCell
                                            width={100}
                                            textAlign="right"
                                        >
                                            {formatMoney(
                                                Number(item.price) *
                                                    item.quantity,
                                            )}
                                        </PdfTableBodyCell>
                                    </PdfTableRow>
                                ))}
                            </PdfTable>
                        </View>

                        <View
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    borderBottom: '0.5px solid #000000',
                                    paddingVertical: 2.5,
                                    width: 146,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 10,
                                        letterSpacing: 10 * -0.025,
                                    }}
                                >
                                    Nettobetrag
                                </Text>
                                <Text style={{ textAlign: 'right' }}>
                                    {price}
                                </Text>
                            </View>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    borderBottom: '0.5px solid #000000',
                                    paddingVertical: 2.5,
                                    width: 146,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 10,
                                        letterSpacing: 10 * -0.025,
                                    }}
                                >
                                    Gesamtbetrag
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        fontWeight: 600,
                                    }}
                                >
                                    {price}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            display: 'flex',
                            width: '100%',
                            gap: 16,
                            paddingBottom: 7,
                        }}
                    >
                        <Text>
                            Nach § 19 UStG wird keine Umsatzsteuer berechnet.
                        </Text>

                        <Text>
                            Der Gesamtbetrag ist innerhalb von 14 Tagen nach
                            Erhalt der Rechnung auf folgendes Bankkonto zu
                            überweisen:
                        </Text>

                        <View
                            style={{
                                fontWeight: 600,
                                paddingVertical: 8,
                                borderStyle: 'solid',
                                borderColor: '#000000',
                                borderTopWidth: 0.5,
                                borderBottomWidth: 0.5,
                            }}
                        >
                            <Text>Florian Münch</Text>
                            <Text>Commerzbank AG</Text>
                            <Text>IBAN: DE43 2004 1144 0816 8106 00</Text>
                            <Text>BIC: COBADEHD044</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
