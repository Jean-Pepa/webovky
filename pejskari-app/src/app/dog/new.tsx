import { useRouter } from 'expo-router';

import { DogForm } from '@/components/dog-form';
import { Screen } from '@/components/ui/screen';
import { useDogs } from '@/store/dog-store';

export default function NewDog() {
  const router = useRouter();
  const { addDog } = useDogs();

  return (
    <Screen>
      <DogForm
        submitLabel="Přidat pejska"
        onSubmit={(data) => {
          addDog(data);
          router.back();
        }}
      />
    </Screen>
  );
}
