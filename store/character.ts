import { defineStore } from 'pinia';
import type { INovelCharacter } from '~/types/character';

export const useCharacterStore = defineStore('character-editor', {
 state: (): { character: INovelCharacter } => ({
  character: {
   character_id: '',
   novel_id: '',
   user_id: '',
   role: 'player',
   name: '',
   appearance: '',
   backstory: '',
   traits: '',
  },
 }),

 actions: {
  setCharacter(data: INovelCharacter) {
   this.character = data;
  },

  updateField<K extends keyof INovelCharacter>(key: K, value: INovelCharacter[K]) {
   this.character[key] = value;
  },

  reset() {
   this.character = {
    character_id: '',
    novel_id: '',
    user_id: '',
    role: 'player',
    name: '',
    appearance: '',
    backstory: '',
    traits: '',
   };
  },
 },
});
