//setTimeout(() => {
  //const listing = document.querySelectorAll('.g-col-1');
  //console.log('delayed listing length:', listing.length);
//}, 2000);

//1. reading listing data from Quarto header
//^ start running this code once the page loads -- otherwise could error given that it has nothing to work with

document.addEventListener('DOMContentLoaded', () => {
    //always check the class of the object: thought quarto grid but actually g-col-1
    // Quarto grid items use Bootstrap class g-col-1
    // older Quarto versions used .quarto-grid-item instead
    const listing = document.querySelectorAll('.g-col-1');
    const wall = document.getElementById('gallery-wall');
    const projects = [];
    //cookiecats, kpop, fashion, beans
    //const baseUrl = window.location.origin;
    const baseUrl = window.location.origin + (window.location.pathname.includes('portfolio') ? '/portfolio' : '');
    const frames = ['dark-wood','gilt', 'polaroid', 'dark-wood'];
    const sizes = ['medium','large', 'strip', 'medium'];
    const shapes =['landscape-rect','mural','narrow', 'oval-wide']; //rectangular, square, mural, narrow, oval-wide, oval-long


    //console.log('listing length:', listing.length);
    //console.log('wall element:', wall);
    //console.log('projects after forEach:', projects);
    

    // single forEach loop
    listing.forEach((item, index) => {
        //console.log('item found:', item);
        //console.log('title:', item.querySelector('.listing-title')?.textContent);
        //console.log('category:', item.dataset.categories);
        //console.log('raw categories:', item.dataset.categories);
        //console.log('decoded:', item.dataset.categories ? atob(item.dataset.categories) : 'empty')
        //console.log('image2:', item.querySelector('.image2')?.textContent?.trim());
        const raw = item.querySelector('.image2')?.textContent?.trim();
        const project = {
            title: item.querySelector('.listing-title')?.textContent?.trim(),
            shortTitle: item.querySelector('.listing-subtitle')?.textContent?.trim() || item.querySelector('.listing-title')?.textContent?.trim(),
            description: item.querySelector('.listing-description')?.textContent.trim(),
            frame: item.dataset.listingFrame || 'dark-wood',
            date: item.querySelector('.listing-date')?.textContent?.trim().split(' ')[2],
            //(()=>{
                //const rawDate = item.dataset.listingDateSort // define objects for date
                //return rawDate ? new Date(parseInt(rawDate)).getFullYear() : '';
            //}),
            category: item.dataset.categories ? atob(item.dataset.categories): '', //atob is a base64 decoder
            image: item.querySelector('.card-img-top img')?.src,
            image2: item.querySelector('.image2')?.textContent?.trim().replace(/^\.\.\//, baseUrl + '/') || null,
            subcategories: item.querySelector('.listing-description')?.textContent?.split(',').map(t => t.trim()) || [],
            number: String(index + 1).padStart(3, '0'),
            frame: frames[index % frames.length],
            size: sizes[index % sizes.length],
            shape: shapes[index %shapes.length],
            href: item.querySelector('a.quarto-grid-link')?.href
        };
        //console.log('raw frame:', item.dataset.listingFrame);
        //console.log('frame value:', project.frame);
        //console.log('size.value:',project.size);
        //console.log('shape value:',project.shape);
        //console.log('project built:', project);

        console.log('raw image2:', raw);
        console.log('replaced:', raw?.replace('../', baseUrl + '/'));

        projects.push(project);
    });

    // the '?'- look for the object but if you can't find it, don't crash just return undefined


    //building each placard - take listing object and input it to a newly built placard
    //${}inserts variables
    // data-category in the outermost section allows that to be how the filter logic starts

    // buildCard outside the forEach but inside DOMContentLoaded
    //outerframe allows for you to use designated frame for each piece
    function buildCard(project) {
        //console.log('frame in buildCard:', project.frame);
        const innerContent = project.frame === 'polaroid'
        ? `
            <img src="${project.image}" alt="${project.title}" class="canvas strip-img"/>
            <div class="strip-divider"></div>
            <img src="${project.image2 || project.image}" alt="${project.title}" class="canvas strip-img"/>
        `
        : `<img src="${project.image}" alt="${project.title}" class="canvas"/>`;

        return `
            <a href="${project.href}" class="piece-link">
                <div class="piece ${project.size} ${project.shape}" data-category="${project.category}">
                    <div class="wire"></div>
                    <div class="frame-outer ${project.frame}"> 
                        <div class="frame-inner">
                            ${innerContent}
                            <div class="metadata-overlay">
                                <div class="placard-title">${project.title}</div>
                                <div class="placard-meta">${project.date}</div>
                                <div class="placard-tags">
                                    ${project.subcategories.map(tag =>
                                        `<span class="tag">${tag.trim()}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="number-plate">No. ${project.number}</div>
                    </div>
                </div>
            </a>
        `;
    }

    //<div class="placard">
        //<div class="placard-num">No. ${project.number}</div>
        //<div class="placard-short-title">${project.shortTitle}</div>
    //</div>
    //if else
    function renderGallery(filter) {
        const filtered = filter === 'all'
            ? projects
            : projects.filter(p => p.category === filter);
        wall.innerHTML = filtered.map(buildCard).join('');
    }
    
    //builds card and the html code that gets stitched together to generate the image
    //console.log('projects array:', projects);
    //console.log('wall before render:', document.getElementById('gallery-wall'));

    renderGallery('all');
    //console.log('wall after render:', document.getElementById('gallery-wall').innerHTML);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn')
                .forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderGallery(this.dataset.filter);
        });
    });
});