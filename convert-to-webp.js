const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Função para converter imagens para WebP
async function convertToWebP() {
    const portifolioDir = './portifolio';
    
    if (!fs.existsSync(portifolioDir)) {
        console.log('Pasta portifolio não encontrada!');
        return;
    }

    // Percorrer todas as pastas do portfólio
    const projects = fs.readdirSync(portifolioDir);
    
    for (const project of projects) {
        const projectPath = path.join(portifolioDir, project);
        
        if (fs.statSync(projectPath).isDirectory()) {
            console.log(`\nProcessando projeto: ${project}`);
            
            // Ler todas as imagens da pasta do projeto
            const images = fs.readdirSync(projectPath).filter(file => 
                file.toLowerCase().endsWith('.jpg') || 
                file.toLowerCase().endsWith('.jpeg') || 
                file.toLowerCase().endsWith('.png')
            );
            
            for (const image of images) {
                const inputPath = path.join(projectPath, image);
                const outputPath = path.join(projectPath, image.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
                
                try {
                    console.log(`  Convertendo: ${image}`);
                    
                    // Converter para WebP com qualidade 85%
                    await sharp(inputPath)
                        .webp({ quality: 85 })
                        .toFile(outputPath);
                    
                    // Verificar tamanho dos arquivos
                    const originalSize = fs.statSync(inputPath).size;
                    const webpSize = fs.statSync(outputPath).size;
                    const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
                    
                    console.log(`    Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
                    console.log(`    WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB`);
                    console.log(`    Redução: ${reduction}%`);
                    
                } catch (error) {
                    console.error(`    Erro ao converter ${image}:`, error.message);
                }
            }
        }
    }
    
    console.log('\n✅ Conversão concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Verifique as imagens WebP geradas');
    console.log('2. Atualize os caminhos nos arquivos HTML/JS');
    console.log('3. Remova as imagens originais se necessário');
}

// Executar conversão
convertToWebP().catch(console.error);
