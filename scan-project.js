const fs = require('fs');
const path = require('path');

// Function to recursively get all files
function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!file.startsWith('node_modules') && !file.startsWith('.next')) {
                fileList = getAllFiles(filePath, fileList);
            }
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Function to check for dynamic routes without generateStaticParams
function checkDynamicRoutes(files) {
    const dynamicRoutes = [];
    files.forEach(file => {
        if (file.includes('[') && file.includes(']') && file.endsWith('page.tsx')) {
            const dir = path.dirname(file);
            const layoutFile = path.join(dir, 'layout.tsx');
            const generateParamsFile = path.join(dir, 'generateStaticParams.ts');
            
            if (!fs.existsSync(layoutFile) && !fs.existsSync(generateParamsFile)) {
                dynamicRoutes.push(file);
            }
        }
    });
    return dynamicRoutes;
}

// Function to check for missing imports
function checkMissingImports(files) {
    const missingImports = [];
    files.forEach(file => {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('React') && !content.includes("import React")) {
                missingImports.push({ file, missing: 'React' });
            }
        }
    });
    return missingImports;
}

// Function to check for inconsistent "use client" directives
function checkClientDirectives(files) {
    const inconsistentFiles = [];
    files.forEach(file => {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(file, 'utf8');
            const hasClientComponents = content.includes('useState') || 
                                     content.includes('useEffect') || 
                                     content.includes('useRouter');
            const hasUseClient = content.includes('"use client"');
            
            if (hasClientComponents && !hasUseClient) {
                inconsistentFiles.push(file);
            }
        }
    });
    return inconsistentFiles;
}

// Main execution
const projectRoot = process.cwd();
console.log('Scanning project...\n');

const allFiles = getAllFiles(projectRoot);

console.log('Checking dynamic routes without generateStaticParams...');
const dynamicRoutesWithoutParams = checkDynamicRoutes(allFiles);
if (dynamicRoutesWithoutParams.length > 0) {
    console.log('\nDynamic routes missing generateStaticParams:');
    dynamicRoutesWithoutParams.forEach(route => console.log(`- ${route}`));
}

console.log('\nChecking for missing imports...');
const missingImports = checkMissingImports(allFiles);
if (missingImports.length > 0) {
    console.log('\nFiles with missing imports:');
    missingImports.forEach(({ file, missing }) => console.log(`- ${file} (missing: ${missing})`));
}

console.log('\nChecking for inconsistent "use client" directives...');
const inconsistentClientDirectives = checkClientDirectives(allFiles);
if (inconsistentClientDirectives.length > 0) {
    console.log('\nFiles with missing "use client" directive:');
    inconsistentClientDirectives.forEach(file => console.log(`- ${file}`));
}

console.log('\nScan complete!');
