import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(localPath: string, publicId: string): Promise<string> {
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    folder: 'arena-ai',
    overwrite: true,
    resource_type: 'image',
  });
  return result.secure_url;
}

export async function uploadAllAssets(): Promise<{
  chapters: Record<string, string>;
  personas: Record<string, string>;
}> {
  const results = {
    chapters: {} as Record<string, string>,
    personas: {} as Record<string, string>,
  };

  const uploadsDir = path.join(process.cwd(), 'client/public/uploads');
  const chaptersDir = path.join(uploadsDir, 'chapters');
  const generatedDir = path.join(process.cwd(), 'attached_assets/generated_images');

  console.log('Uploading chapter cover images...');
  
  const chapterImages = [
    { file: 'door_to_door_sales_rep_knocking.png', slug: 'chapter-1-cover' },
    { file: 'sales_rep_talking_to_homeowner_on_lawn.png', slug: 'chapter-2-cover' },
  ];

  for (const img of chapterImages) {
    const localPath = path.join(generatedDir, img.file);
    if (fs.existsSync(localPath)) {
      const url = await uploadImage(localPath, `chapters/${img.slug}`);
      results.chapters[img.slug] = url;
      console.log(`  Uploaded ${img.slug}: ${url}`);
    }
  }

  console.log('Uploading persona images...');
  
  const personaImages = [
    { file: 'persona-the-rushed-executive-1767319703503.png', slug: 'rp-rushed-executive' },
    { file: 'persona-the-skeptic-1767319717985.png', slug: 'rp-skeptic' },
    { file: 'persona-the-gatekeeper-1767319732601.png', slug: 'rp-gatekeeper' },
    { file: 'persona-the-diy-pro-1767319746018.png', slug: 'rp-diy-pro' },
    { file: 'persona-the-loyalist-1767319759620.png', slug: 'rp-loyalist' },
    { file: 'persona-the-confused-homeowner-1767319773412.png', slug: 'rp-confused-homeowner' },
    { file: 'persona-the-denialist-1767319787105.png', slug: 'rp-denialist' },
    { file: 'persona-the-apathetic-owner-1767319801894.png', slug: 'rp-apathetic-owner' },
    { file: 'persona-the-visual-skeptic-1767319815477.png', slug: 'rp-visual-skeptic' },
    { file: 'persona-the-price-shopper-1767319828752.png', slug: 'rp-price-shopper' },
    { file: 'persona-the-budget-watcher-1767319842969.png', slug: 'rp-budget-watcher' },
    { file: 'persona-the-comparison-shopper-1767319859115.png', slug: 'rp-comparison-shopper' },
    { file: 'persona-the-cautious-buyer-1767319872711.png', slug: 'rp-cautious-buyer' },
    { file: 'persona-the-indecisive-prospect-1767319886633.png', slug: 'rp-indecisive-prospect' },
    { file: 'persona-the-defeater-1767319899954.png', slug: 'rp-defeater' },
    { file: 'persona-the-ultimate-test-1767319913994.png', slug: 'rp-ultimate-test' },
  ];

  for (const img of personaImages) {
    const localPath = path.join(uploadsDir, img.file);
    if (fs.existsSync(localPath)) {
      const url = await uploadImage(localPath, `personas/${img.slug}`);
      results.personas[img.slug] = url;
      console.log(`  Uploaded ${img.slug}: ${url}`);
    }
  }

  return results;
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  uploadAllAssets()
    .then((results) => {
      console.log('\n=== Upload Complete ===');
      console.log('Chapter URLs:', JSON.stringify(results.chapters, null, 2));
      console.log('Persona URLs:', JSON.stringify(results.personas, null, 2));
    })
    .catch(console.error);
}
