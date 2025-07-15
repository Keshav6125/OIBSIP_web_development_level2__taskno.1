class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement
    this.currentOperandElement = currentOperandElement
    this.clear()
  }

  clear() {
    this.currentOperand = ""
    this.previousOperand = ""
    this.operation = undefined
    this.shouldResetDisplay = false
  }

  delete() {
    if (this.currentOperand === "Error") {
      this.clear()
      return
    }
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {
    if (this.shouldResetDisplay) {
      this.currentOperand = ""
      this.shouldResetDisplay = false
    }

    if (this.currentOperand === "Error") {
      this.clear()
    }

    if (number === "." && this.currentOperand.includes(".")) return

    // Limit the number of digits
    if (this.currentOperand.length >= 12) return

    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return
    if (this.currentOperand === "Error") {
      this.clear()
      return
    }

    if (this.previousOperand !== "") {
      this.compute()
    }

    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ""
  }

  compute() {
    let computation
    const prev = Number.parseFloat(this.previousOperand)
    const current = Number.parseFloat(this.currentOperand)

    if (isNaN(prev) || isNaN(current)) return

    switch (this.operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "×":
        computation = prev * current
        break
      case "÷":
        if (current === 0) {
          this.displayError()
          return
        }
        computation = prev / current
        break
      default:
        return
    }

    // Round to avoid floating point precision issues
    computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000

    // Check for overflow
    if (!isFinite(computation)) {
      this.displayError()
      return
    }

    this.currentOperand = computation.toString()
    this.operation = undefined
    this.previousOperand = ""
    this.shouldResetDisplay = true

    // Add animation
    this.currentOperandElement.classList.add("display-update")
    setTimeout(() => {
      this.currentOperandElement.classList.remove("display-update")
    }, 200)
  }

  displayError() {
    this.currentOperand = "Error"
    this.operation = undefined
    this.previousOperand = ""
    this.shouldResetDisplay = true

    // Add error animation
    this.currentOperandElement.classList.add("error")
    setTimeout(() => {
      this.currentOperandElement.classList.remove("error")
    }, 500)
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = Number.parseFloat(stringNumber.split(".")[0])
    const decimalDigits = stringNumber.split(".")[1]

    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ""
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      })
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    if (this.currentOperand === "") {
      this.currentOperandElement.innerText = "0"
    } else {
      this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand)
    }

    if (this.operation != null) {
      this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandElement.innerText = ""
    }
  }
}

// Initialize calculator
const previousOperandElement = document.getElementById("previous-operand")
const currentOperandElement = document.getElementById("current-operand")

const calculator = new Calculator(previousOperandElement, currentOperandElement)

// Update display initially
calculator.updateDisplay()

// Update display after each operation
const originalUpdateDisplay = calculator.updateDisplay.bind(calculator)
calculator.updateDisplay = () => {
  originalUpdateDisplay()
}

// Override methods to include display updates
const originalClear = calculator.clear.bind(calculator)
calculator.clear = function () {
  originalClear()
  this.updateDisplay()
}

const originalDelete = calculator.delete.bind(calculator)
calculator.delete = function () {
  originalDelete()
  this.updateDisplay()
}

const originalAppendNumber = calculator.appendNumber.bind(calculator)
calculator.appendNumber = function (number) {
  originalAppendNumber(number)
  this.updateDisplay()
}

const originalChooseOperation = calculator.chooseOperation.bind(calculator)
calculator.chooseOperation = function (operation) {
  originalChooseOperation(operation)
  this.updateDisplay()
}

const originalCompute = calculator.compute.bind(calculator)
calculator.compute = function () {
  originalCompute()
  this.updateDisplay()
}

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key

  // Numbers and decimal point
  if ((key >= "0" && key <= "9") || key === ".") {
    calculator.appendNumber(key)
  }

  // Operations
  if (key === "+") {
    calculator.chooseOperation("+")
  } else if (key === "-") {
    calculator.chooseOperation("-")
  } else if (key === "*") {
    calculator.chooseOperation("×")
  } else if (key === "/") {
    event.preventDefault() // Prevent browser search
    calculator.chooseOperation("÷")
  }

  // Equals
  if (key === "Enter" || key === "=") {
    event.preventDefault()
    calculator.compute()
  }

  // Clear
  if (key === "Escape" || key.toLowerCase() === "c") {
    calculator.clear()
  }

  // Delete/Backspace
  if (key === "Backspace" || key === "Delete") {
    calculator.delete()
  }
})

// Add button press visual feedback
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("mousedown", function () {
    this.style.transform = "translateY(0)"
  })

  button.addEventListener("mouseup", function () {
    this.style.transform = "translateY(-2px)"
  })

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(-2px)"
  })
})

// Add some fun easter eggs
let clickCount = 0
document.querySelector(".calculator-info h2").addEventListener("click", function () {
  clickCount++
  if (clickCount === 5) {
    this.style.animation = "shake 0.5s ease-in-out"
    setTimeout(() => {
      this.style.animation = ""
      clickCount = 0
    }, 500)
  }
})

console.log("🧮 Modern Calculator loaded successfully!")
console.log("💡 Tip: You can use your keyboard to operate the calculator!")
console.log("⌨️  Supported keys: 0-9, +, -, *, /, Enter/=, Escape/C, Backspace/Delete")
