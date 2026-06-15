import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { DogForm } from '@/components/dog-form';
import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { useDogs } from '@/store/dog-store';

export default function EditDog() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dogs, updateDog, removeDog } = useDogs();
  const dog = dogs.find((d) => d.id === id);

  if (!dog) {
    return (
      <Screen>
        <ThemedText>Pejsek nenalezen.</ThemedText>
      </Screen>
    );
  }

  function handleDelete() {
    Alert.alert('Odebrat pejska?', `Smaže se profil i pokrok psa ${dog!.name}.`, [
      { text: 'Zrušit', style: 'cancel' },
      {
        text: 'Odebrat',
        style: 'destructive',
        onPress: () => {
          removeDog(dog!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen>
      <DogForm
        initial={dog}
        submitLabel="Uložit změny"
        onSubmit={(data) => {
          updateDog(dog.id, data);
          router.back();
        }}
        onDelete={dogs.length > 1 ? handleDelete : undefined}
      />
    </Screen>
  );
}
