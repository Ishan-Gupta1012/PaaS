import os

replacements = {
    'bg-background': 'bg-[#050505]',
    'text-on-background': 'text-white',
    'bg-surface-container-lowest': 'bg-[#111111]',
    'bg-surface-container-low': 'bg-[#1a1a1a]',
    'bg-surface-container': 'bg-[#222222]',
    'bg-surface-container-highest': 'bg-[#333333]',
    'border-outline-variant': 'border-white/10',
    'border-surface-container-high': 'border-white/10',
    'text-on-surface-variant': 'text-gray-400',
    'text-on-surface': 'text-gray-100',
    'bg-primary-container': 'bg-[#0066FF]/10',
    'text-on-primary-container': 'text-[#0066FF]',
    'text-title-md': 'text-lg',
    'text-label-md': 'text-sm',
    'text-label-sm': 'text-xs',
    'text-body-md': 'text-base',
    'text-body-lg': 'text-lg',
    'text-headline-sm': 'text-xl',
    'text-headline-lg': 'text-3xl',
    'text-display-md': 'text-4xl',
    'text-display-lg': 'text-5xl'
}

directory = 'src/components/templates/ModernDeveloper'

for filename in os.listdir(directory):
    if filename.endswith('.tsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        with open(filepath, 'w') as f:
            f.write(content)
            
print("Done!")
