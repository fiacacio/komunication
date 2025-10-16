const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertImages() {
    console.log('🔍 Procurando pastas de imagens...');
    
    // Procurar pelas pastas de imagens
    const possiblePaths = [
        './portifolio',
        '../portifolio',
        '../../portifolio',
        './imagens',
        '../imagens',
        './backgrounds',
        '../backgrounds'
    ];
    
    let portifolioPath = null;
    for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
            portifolioPath = testPath;
            console.log(`✅ Pasta encontrada: ${testPath}`);
            break;
        }
    }
    
    if (!portifolioPath) {
        console.log('❌ Nenhuma pasta de imagens encontrada!');
        console.log('📁 Diretório atual:', process.cwd());
        console.log('📂 Conteúdo atual:');
        fs.readdirSync('.').forEach(file => {
            console.log(`   ${file}`);
        });
        return;
    }
    
    console.log(`\n🚀 Convertendo imagens em: ${portifolioPath}`);
    
    // Processar projetos
    const projects = fs.readdirSync(portifolioPath).filter(item => 
        fs.statSync(path.join(portifolioPath, item)).isDirectory()
    );
    
    for (const project of projects) {
        const projectPath = path.join(portifolioPath, project);
        console.log(`\n📁 Projeto: ${project}`);
        
        const images = fs.readdirSync(projectPath).filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );
        
        for (const image of images) {
            const inputPath = path.join(projectPath, image);
            const baseName = image.replace(/\.(jpg|jpeg|png)$/i, '');
            const outputPath = path.join(projectPath, `${baseName}.webp`);
            const output480 = path.join(projectPath, `${baseName}-480.webp`);
            const output768 = path.join(projectPath, `${baseName}-768.webp`);
            const output1200 = path.join(projectPath, `${baseName}-1200.webp`);
            
            try {
                console.log(`  🔄 Convertendo: ${image}`);
                
                const originalSize = fs.statSync(inputPath).size;
                
                const img = sharp(inputPath);
                const metadata = await img.metadata();
                await img.webp({ quality: 85 }).toFile(outputPath);
                // Variantes responsivas preservando proporção
                if (metadata.width) {
                    const width = metadata.width;
                    const targets = [
                        { w: 480, out: output480 },
                        { w: 768, out: output768 },
                        { w: 1200, out: output1200 }
                    ].filter(t => width >= t.w);
                    for (const t of targets) {
                        await sharp(inputPath)
                            .resize({ width: t.w, withoutEnlargement: true })
                            .webp({ quality: 80 })
                            .toFile(t.out);
                    }
                }
                
                const webpSize = fs.statSync(outputPath).size;
                const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
                
                console.log(`    ✅ Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
                console.log(`    ✅ WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB`);
                console.log(`    📉 Redução: ${reduction}%`);
                
            } catch (error) {
                console.error(`    ❌ Erro: ${error.message}`);
            }
        }
    }
    
    console.log('\n🎉 Conversão concluída!');
}

convertImages().catch(console.error);
