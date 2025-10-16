const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Função para converter imagens do projeto KOMUNICATION para WebP
async function convertKomunicationToWebP() {
    console.log('🚀 Iniciando conversão das imagens do KOMUNICATION para WebP...\n');
    
    // Lista de arquivos para converter
    const filesToConvert = [
        'background.jpg',
        'k.png',
        'logo_empresa.png',
        'logo_empresa_png2.png'
    ];
    
    // Converter arquivos na raiz
    for (const file of filesToConvert) {
        const inputPath = path.join('.', file);
        
        if (fs.existsSync(inputPath)) {
            const outputPath = path.join('.', file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
            
            try {
                console.log(`📸 Convertendo: ${file}`);
                
                // Converter para WebP com qualidade 85%
                await sharp(inputPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);
                
                // Verificar tamanho dos arquivos
                const originalSize = fs.statSync(inputPath).size;
                const webpSize = fs.statSync(outputPath).size;
                const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
                
                console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
                console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB`);
                console.log(`   Redução: ${reduction}%\n`);
                
            } catch (error) {
                console.error(`   ❌ Erro ao converter ${file}:`, error.message);
            }
        } else {
            console.log(`   ⚠️  Arquivo não encontrado: ${file}`);
        }
    }
    
    // Converter imagens da pasta parceiros
    const parceirosDir = './parceiros';
    if (fs.existsSync(parceirosDir)) {
        console.log('📁 Convertendo imagens da pasta parceiros...\n');
        
        const images = fs.readdirSync(parceirosDir).filter(file => 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.jpeg') || 
            file.toLowerCase().endsWith('.png')
        );
        
        for (const image of images) {
            const inputPath = path.join(parceirosDir, image);
            const outputPath = path.join(parceirosDir, image.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
            
            try {
                console.log(`📸 Convertendo parceiro: ${image}`);
                
                await sharp(inputPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);
                
                const originalSize = fs.statSync(inputPath).size;
                const webpSize = fs.statSync(outputPath).size;
                const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
                
                console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
                console.log(`   WebP: ${(webpSize / 1024).toFixed(1)}KB`);
                console.log(`   Redução: ${reduction}%\n`);
                
            } catch (error) {
                console.error(`   ❌ Erro ao converter ${image}:`, error.message);
            }
        }
    }
    
    console.log('✅ Conversão do KOMUNICATION concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Atualizar os caminhos no CSS e HTML para usar .webp');
    console.log('2. Testar no navegador');
    console.log('3. Fazer commit das novas imagens WebP');
}

// Executar conversão
convertKomunicationToWebP().catch(console.error);
