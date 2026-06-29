import { MemoryData } from '../store/useAppStore';

const getAssetUrl = (filename: string) => {
  try {
    return new URL(`../../../assets/${filename}`, import.meta.url).href;
  } catch {
    return `/assets/${filename}`; // fallback
  }
};

// Distribute memories around the user in a sphere
export const memoriesData: MemoryData[] = [
  {
    id: 'mem1',
    date: 'Apr 2025',
    location: 'Puttur, 11:45 AM',
    story: 'We enjoyed a lot in the final year fiesta and danced and enjoyed well in the party of our college.',
    emotion: 'Joy & Celebration',
    imageUrl: getAssetUrl('mem1.jpg'),
    position: [0, 0, 0], // Dynamically placed later
  },
  {
    id: 'mem2',
    date: 'Sep 2025',
    location: '3:30 PM',
    story: 'We took this photo on the occasion of certificates receiving of graduated in our diploma.',
    emotion: 'Pride & Achievement',
    imageUrl: getAssetUrl('mem2.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem3',
    date: '22 March 2026',
    location: 'Tirumala, 5:30 PM',
    story: 'We took this photo when we gone to tirumala before dharshanam and we enjoyed and talked so many gossips and laughed for so many jokes.',
    emotion: 'Happiness & Laughter',
    imageUrl: getAssetUrl('mem3.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem4',
    date: '23 March 2026',
    location: 'Tirumala, 6:30 PM',
    story: 'We enjoyed a lot and faced so many struggles and kept smiling in every situation in tirumala. Before going to tirupati we took this photo with so much of loveee.',
    emotion: 'Love & Resilience',
    imageUrl: getAssetUrl('mem4.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem5',
    date: '23 March 2026',
    location: 'Tirumala, 6:30 PM',
    story: 'Before going to tirupati we finding a spot to take pictures but we took this photo in the gallery in tirumala with so much of intimacy.',
    emotion: 'Intimacy',
    imageUrl: getAssetUrl('mem5.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem6',
    date: '23 March 2026',
    location: 'Enroute to Tirupati, 7:00 PM',
    story: 'On the enroute to tirupati we talked lots of memories and plannings and u slept on my shoulder in the bus that was so mesmerizing me, then u slept like a little kid baby...',
    emotion: 'Mesmerizing & Sweet',
    imageUrl: getAssetUrl('mem6.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem7',
    date: '17 Jan 2026',
    location: '11:45 AM',
    story: 'We are talking in the outer face of anger like we are strangers but still close to both our inner hearts. When we are talking about pigeons on the building tejesh clicks this photo...',
    emotion: 'Hidden Love',
    imageUrl: getAssetUrl('mem7.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem8',
    date: '17 Jan 2026',
    location: 'ISCKON Temple, 12:15 PM',
    story: 'That u r thinking to take pictures with me but at the last you took the picture in the ISCKON temple tirupati we cooled the anger after this moment...',
    emotion: 'Forgiveness & Peace',
    imageUrl: getAssetUrl('mem8.jpg'),
    position: [0, 0, 0],
  },
  {
    id: 'mem9',
    date: 'October 2024',
    location: '2:00 PM',
    story: 'On this moment we take our first photo with u seperately and group photos and also our friends are mismers about our relation that u didnt know that im already in love with u in that situation. But we took the picture but the heart rate are raising in our both hearts... but it feels awesome moment.',
    emotion: 'First Love & Butterflies',
    imageUrl: getAssetUrl('mem9.jpeg'),
    position: [0, 0, 0],
  }
];
