const app = () => {
  // check if a class is present in an element
  const check = (element, attribute) => element.classList.contains(attribute)
  // check if a class is expanded and change aria-expanded value
  const isExpanded = (element) => {
    return element.attributes["aria-expanded"].value === "true"
  }


  // Function to toggle  menus
  const toggle = (item) => {
    item.classList.toggle("hide")
  }

  const toggleMenu = (trigger, menu, opMenu) => {
    const MenuItems = menu.querySelectorAll(`[role="menuitem"]`);

    const closeMenu = () => {
      trigger.ariaExpanded = "false"
      trigger.focus()
    }

    const handleExcapeKeypress = (e) => {
      if(e.key === 'Escape') {
        toggleMenu(trigger, menu, opMenu)
      }
    }

    const handleMenuArrowKeypress = (e, index) => {
      const isLast = index === MenuItems.length - 1
      const isFirst = index === 0

      const nextItem = MenuItems.item(index+1)
      const prevItem = MenuItems.item(index-1)
      const last = MenuItems.length - 1

      // if arrow down or right is clicked
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // if user is on last, focus on first
        // then focus on next element
        isLast ? MenuItems.item(0).focus() : nextItem.focus()
      }

      // if arrow up or left is clicked
      if(e.key === "ArrowLeft" || e.key === 'ArrowUp') {
        // if user is on first, focus on last
        // then focus of previous element
        isFirst ? MenuItems.item(last).focus() : prevItem.focus()
      }

    }

    const openMenu = () => {
      trigger.ariaExpanded = "true"
      MenuItems.item(0).focus()
      menu.addEventListener('keyup', (e)=>handleExcapeKeypress(e))

      // for each menu item reg an event listner for key up
      MenuItems.forEach((item, index)=>{
        item.addEventListener('keyup', (e) => {
          handleMenuArrowKeypress(e, index)
        })
      })

    }

    if (opMenu) {
      if(check(opMenu, "hide")){
        toggle(menu);
      } else {
        toggle(opMenu);
        toggle(menu);
      };
    } else {
      toggle(menu)
    }

    if(isExpanded(trigger)){
      closeMenu()
    } else {
      openMenu()
    };
  }


  // hide promo alert
  const hidePromo = document.querySelector(".clear")
  const promoBar = document.querySelector(".promo")

  hidePromo.addEventListener("click", ()=> toggle(promoBar))


  // expand alert when clicked
  const alertTrigger = document.querySelector("#alert-expand");
  const alertMenu = document.querySelector(".alert")

  // toggle profile menu
  alertTrigger.addEventListener("click", () => {
    toggleMenu(alertTrigger, alertMenu, profileMenu);
  })


  // expand profile when clicked
  const profileTrigger = document.querySelector("#profile-expand");
  const profileMenu = document.querySelector(".navbar");

  // toggle profile menu
  profileTrigger.addEventListener("click", () => {
    toggleMenu(profileTrigger, profileMenu, alertMenu)
  });


  // expand setup-menu when clicked
  const setupTrigger = document.querySelector("#expand-setup");
  const setupMenu = document.querySelector(".accordion");

  // toggle setup-menu
  const handleArrowCloseOpen = () => {
    const arrowDown = setupTrigger.querySelector("#open")
    const arrowUp = setupTrigger.querySelector("#close")

    arrowDown.classList.toggle('hide')
    arrowUp.classList.toggle('hide')

  }
  setupTrigger.addEventListener("click", () => {
    toggleMenu(setupTrigger, setupMenu);
    handleArrowCloseOpen();
    setupList.item(0).focus()
  });



  // HANDLE GUIDE ELEMENTS
  const setupList = document.querySelectorAll('.setups')

  setupList.forEach((guideItem, index)=>{
    // ========== CONSTANTS ============= //

    // get buttons
    const id = index+1
    const btn = document.querySelector(`#status${id}`)
    const btnStat = document.querySelector(`.stat${id}`);

    // get icons
    const btnCompleted = btn.querySelector(`.checked`);
    const spinner = btn.querySelector(`.spinner`);
    const btnUnCompleted = btn.querySelector(`.statusIcon`);

    const itemDetails = guideItem.querySelector('.details')
    const itemImage = guideItem.querySelector('.illustration')
    const itemBtn = itemDetails.querySelector('button')
    const notCompleted = !guideItem.classList.contains('completed')

    const progress = document.querySelector('#progressCount')

    const isLast = setupList.length - 1 === index

    // ========== CONSTANTS ENDS ============= //

    ////////////////////////////////////////////////////////
    // on click, hide empty box
    const handleDone = () => {
      const progressVal = document.querySelector('#progress')
      const preValue = parseInt(progressVal.innerHTML)
      btnUnCompleted.classList.add('hide');
      spinner.classList.remove("hide");

      btnStat.ariaLabel = "Loading, please wait..."
      console.log(btnStat.ariaLabel)

      setTimeout(() => {
        spinner.classList.add('hide')
        btnCompleted.classList.remove('hide')

        btn.ariaLabel = btn.ariaLabel.replace('as not done', 'as done')
        btnStat.ariaLabel = "succesfully marked as done"
        console.log(btnStat.ariaLabel)

        progress.value+=1
        progressVal.innerHTML = preValue + 1
        guideItem.classList.add('completed')
      }, 500)
    }

    // on click, show empty box
    const handleNotDone = () => {
      const progressVal = document.querySelector('#progress')
      const preValue = parseInt(progressVal.innerHTML)
      btnCompleted.classList.add('hide')
      spinner.classList.remove('hide')

      btnStat.ariaLabel = "Loading, please wait..."
      console.log(btnStat.ariaLabel)

      setTimeout(() => {
        spinner.classList.add('hide')
        btnUnCompleted.classList.remove('hide')

        btn.ariaLabel = btn.ariaLabel.replace('as done', 'as not done')
        btnStat.ariaLabel = "succesfully marked as not done"
        console.log(btnStat.ariaLabel)

        progress.value-=1
        progressVal.innerHTML = preValue - 1
        guideItem.classList.remove('completed')
      }, 500);
    }


    const handleDoneorNotDone = () => {
      const markedAsDone = guideItem.classList.contains('completed')

      if(markedAsDone){
        handleNotDone()
      } else {
        handleDone()
      }
    }
    ////////////////////////////////////////////////////////


    const handleFocus = () => {
      if(notCompleted){
        itemDetails.classList.remove('hide')
        itemImage.classList.remove('hide')
        guideItem.focus()
      }
    }
    const handleBlur = () => {
      if(notCompleted){
        itemImage.classList.add('hide')
        itemDetails.classList.add("hide")
      }
    }
    const handleBtnFocus = () => {
      let items = []

      for (let i = 0; i < setupList.length; i++) {
        let newArr = []
        newArr.push(setupList[i])

        let item = setupList.item(i)

        if (!item.classList.contains('completed')) {
          items.push(item)
        }
      }

      // if (!items[1]) {
      //   setupList.item(0).focus()
      // } else {
      //   items[1].focus()
      // }

      if (items.length !== 0) {
        if (isLast) {
          setupList.item(0).focus()
        } else {
          items[1].focus()
        }
      } else {
        null
      }

    }



    btn.addEventListener('click', ()=>{
      handleDoneorNotDone();
    });

    btn.addEventListener('focus', () => {
      handleBtnFocus()
    })

    btn.addEventListener('blur', () => {
      handleBlur()
    })

    itemDetails.addEventListener('click', () => {
      itemDetails.classList.remove('hide')
    })
    guideItem.addEventListener('focus', () => {
      handleFocus()
    })
    guideItem.addEventListener('blur', () => {
      handleBlur()
    })
    itemBtn.addEventListener('focus', () => {
      handleFocus()
    })
  })


  // ======================================================= //

}

app()