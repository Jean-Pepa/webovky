import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IoniconsProps = ComponentProps<typeof Ionicons>;
export type IconName = IoniconsProps['name'];

/** Tenký wrapper nad Ionicons, který přijímá název ikony jako string. */
export function Icon({ name, ...rest }: { name: string } & Omit<IoniconsProps, 'name'>) {
  return <Ionicons name={name as IconName} {...rest} />;
}
