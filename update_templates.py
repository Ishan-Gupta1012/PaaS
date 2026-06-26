import sys

with open("src/app/dashboard/templates/page.tsx", "r") as f:
    lines = f.readlines()

new_main = """        {/* Main Content */}
        <main className="flex-1 p-lg md:p-xl space-y-xl max-w-container-max mx-auto w-full">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold">Templates</h2>
            <p className="text-on-surface-variant mt-xs">Select a template to start building your portfolio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Slot 1 */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-full aspect-video bg-surface-container-low rounded-lg mb-md flex items-center justify-center overflow-hidden relative">
                <LayoutTemplate size={48} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-primary text-on-primary px-md py-sm rounded-lg font-semibold">Select Template</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold">Modern Developer</h3>
              <p className="text-label-sm text-on-surface-variant mt-xs">Clean, minimalist design for modern software engineers.</p>
            </div>
            
            {/* Slot 2 */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-full aspect-video bg-surface-container-low rounded-lg mb-md flex items-center justify-center overflow-hidden relative">
                <Code2 size={48} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-primary text-on-primary px-md py-sm rounded-lg font-semibold">Select Template</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold">Creative Portfolio</h3>
              <p className="text-label-sm text-on-surface-variant mt-xs">Stand out with bold colors and unique layouts.</p>
            </div>

            {/* Slot 3 */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="w-full aspect-video bg-surface-container-low rounded-lg mb-md flex items-center justify-center overflow-hidden relative">
                <Rocket size={48} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-primary text-on-primary px-md py-sm rounded-lg font-semibold">Select Template</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold">Enterprise Pro</h3>
              <p className="text-label-sm text-on-surface-variant mt-xs">Professional layout suited for enterprise consultants.</p>
            </div>
          </div>
        </main>
"""

new_lines = lines[:126] + [new_main] + lines[595:]

with open("src/app/dashboard/templates/page.tsx", "w") as f:
    f.writelines(new_lines)
