import { Text, View } from '@react-pdf/renderer'
import type { FC, PropsWithChildren } from 'react'

export const PdfTable: FC<PropsWithChildren> = ({ children }) => (
  <View style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid #000000' }}>{children}</View>
)

export const PdfTableHeader: FC<PropsWithChildren> = ({ children }) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      borderTop: '0.5px solid #000',
    }}
  >
    {children}
  </View>
)

export const PdfTableHeaderCell: FC<
  PropsWithChildren & {
    width?: string | number
    flex?: string | number
    textAlign?: 'center' | 'left' | 'right'
  }
> = ({ children, width, flex, textAlign }) => (
  <View
    style={{
      paddingVertical: 4,
      fontWeight: 600,
      fontSize: 9,
      letterSpacing: 9 * -0.025,
      lineHeight: 1.2,

      width,
      flex,
      textAlign,
    }}
  >
    <Text>{children}</Text>
  </View>
)

export const PdfTableRow: FC<PropsWithChildren> = ({ children }) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      borderTop: '0.5px solid #000000',
    }}
  >
    {children}
  </View>
)

export const PdfTableBodyCell: FC<
  PropsWithChildren<{
    width?: string | number
    flex?: string | number
    textAlign?: 'center' | 'left' | 'right'
  }>
> = ({ children, width, flex, textAlign }) => (
  <View style={{ paddingVertical: 16, width, flex, textAlign }}>
    <Text>{children}</Text>
  </View>
)
