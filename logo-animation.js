document.addEventListener('DOMContentLoaded', function() {
    const logoImg = document.querySelector('.logo img');
    const logo = document.querySelector('.logo');
    
    if (!logoImg) return;

    logo.style.perspective = '1000px';

    const logoSelection = d3.select(logoImg);

    logoSelection.style('transform-origin', 'center center');
    logoSelection.style('transform-style', 'preserve-3d');

    let idleRotationY = 0;
    const idleInterval = setInterval(() => {
        idleRotationY = Math.sin(Date.now() * 0.001) * 5;
        logoSelection.style('transform', `rotateY(${idleRotationY}deg) scale(1)`);
    }, 30);

    logoImg.addEventListener('mouseenter', function() {
        clearInterval(idleInterval);

        d3.select(this)
            .transition()
            .duration(600)
            .style('transform', 'rotateY(360deg) rotateX(15deg) scale(1.1)')
            .transition()
            .duration(600)
            .style('transform', 'rotateY(720deg) rotateX(-15deg) scale(1.15)')
            .on('end', function() {
                d3.select(this)
                    .transition()
                    .duration(400)
                    .style('transform', 'rotateY(0deg) rotateX(0deg) scale(1.15)')
                    .style('filter', 'drop-shadow(0 0 12px rgba(27, 133, 114, 0.6))');
            });
    });

    logoImg.addEventListener('mouseleave', function() {
        d3.select(this)
            .transition()
            .duration(500)
            .style('transform', 'rotateY(0deg) rotateX(0deg) scale(1)')
            .style('filter', 'drop-shadow(0 0 0px rgba(27, 133, 114, 0))');

        idleRotationY = 0;
        idleInterval = setInterval(() => {
            idleRotationY = Math.sin(Date.now() * 0.001) * 5;
            logoSelection.style('transform', `rotateY(${idleRotationY}deg) scale(1)`);
        }, 30);
    });

    logoImg.addEventListener('click', function(e) {
        e.preventDefault();
        clearInterval(idleInterval);

        d3.select(this)
            .transition()
            .duration(400)
            .style('transform', 'rotateY(360deg) rotateZ(180deg) scale(1.1)')
            .transition()
            .duration(400)
            .style('transform', 'rotateY(720deg) rotateZ(360deg) scale(1.05)')
            .transition()
            .duration(300)
            .style('transform', 'rotateY(0deg) rotateZ(0deg) scale(1)')
            .on('end', function() {
                idleRotationY = 0;
                idleInterval = setInterval(() => {
                    idleRotationY = Math.sin(Date.now() * 0.001) * 5;
                    logoSelection.style('transform', `rotateY(${idleRotationY}deg) scale(1)`);
                }, 30);
            });
    });
});
