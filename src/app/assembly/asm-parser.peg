Start =
	__
    data:
    (
    	"section"i _ ".data"i  Comment? __
    	data:(data:DataLine { return { line: data, location: location() }; })*
    	{ return data; }
    )?
    __
    text:
    (
    	"section"i _ ".text"i Comment? __
        text:(text:TextLine { return { line: text, location: location() }; })*
        { return text; }
    )?
    { return { data: data !== null ? data : [], text: text !== null ? text : []}; }

EmptyLine =
	Comment / _

Comment =
	_ ";" [^\n]*

DataLine =
	(label:Label? _ size:DataSize _ constant:DataConstant constants:(_ "," _ c:DataConstant { return c; })* Comment? __
    {
    	return { label: label, size: size, constants: [constant].concat(constants) };
    }) /
    (label:Label Comment? __ { return { label: label, size: null, constants: [] }; })

DataConstant =
	Number / String

DataSize =
	"db"i { return 1; } /
    "dw"i { return 2; } /
    "dd"i { return 4; }

TextLine =
	(_ label:Label? _ inst:Instruction Comment? __ { return { tag: "Line", label: label, instruction: inst }; }) /
    (_ label:Label Comment? __ { return { tag: "Line", label: label, instruction: null }; })

Label =
	local:"."? name:Identifier ":" { return { tag: "Label", name: name, local: local !== null }; }

Instruction =
	NoOperandInstruction / JumpInstruction / SingleOperandInstruction /
    MemoryInstruction / ArithmeticInstruction / CompareInstruction

NoOperandInstruction =
	("CLD"i / "STD"i / "CLC"i / "STC"i / "ENTER"i / "RET"i / "LEAVE"i / "HLT"i)
	{ return { tag: "Instruction", type: "NoOperand", name: text() }; }

JumpInstruction =
	name:$(
    	"JMP"i / "JE"i / "JNE"i / "JZ"i / "JNZ"i / "JB"i / "JNAE"i / "JC"i /
    	"JNB"i / "JAE"i / "JNC"i / "JBE"i / "JNA"i / "JA"i / "JNBE"i / "JL"i /
        "JNGE"i / "JGE"i / "JNL"i / "JLE"i / "JNG"i / "JG"i / "JNLE"i / "JCXZ"i /
        "JECXZ"i / "JP"i / "JPE"i / "JNP"i / "JPO"i / "JO"i / "JNO"i / "JS"i /
        "JNS"i / "CALL"i / "LOOP"i
    ) _ target:ReadableExpression
    { return { tag: "Instruction", type: "Jump", name: name, operands: [target] }; }

SingleOperandInstruction =
	name:$(
    	"POP"i / "INC"i / "DEC"i
    ) _ target:WritableExpression { return { tag: "Instruction", type: "SingleOperand", name: name, operands: [target] }; } /
    name:$(
    	"PUSH"i / "INT"i
    ) _ target:ReadableExpression { return { tag: "Instruction", type: "SingleOperand", name: name, operands: [target] }; }

MemoryInstruction =
	name:$("MOV"i / "MOVSX"i) _ target:WritableExpression _ "," _ source:ReadableExpression
    { return { tag: "Instruction", type: "Memory", name: name, operands: [target, source] }; }

ArithmeticInstruction =
	(
	    name:$("ADD"i / "SUB"i / "ADC"i / "SBB"i) _ target:WritableExpression "," _ source:ReadableExpression
        { return { tag: "Instruction", type: "Arithmetic", name: name, operands: [target, source] }; }
    ) /
    (
        name:$("MUL"i / "IMUL"i / "DIV"i / "IDIV"i) _ source:ReadableExpression
        { return { tag: "Instruction", type: "Arithmetic", name: name, operands: [source] }; }
    )

CompareInstruction =
    name:$("CMP"i) _ op1:ReadableExpression _ "," _ op2:ReadableExpression
    { return { tag: "Instruction", type: "Compare", name: name, operands: [op1, op2] }; }

WritableExpression =
	Register /
    cast:SizeCast _ value:RegisterDereferenceExpression { return { tag: "Cast", size: cast, value: value }; } /
    cast:SizeCast _ value:AddressDereferenceExpression { return { tag: "Cast", size: cast, value: value }; }

ReadableExpression =
	Register /
    cast:SizeCast _ value:RegisterDereferenceExpression { return { tag: "Cast", size: cast, value: value }; } /
    cast:SizeCast _ value:AddressDereferenceExpression { return { tag: "Cast", size: cast, value: value }; } /
    cast:SizeCast _ value:LabelExpression { return { tag: "Cast", size: cast, value: value }; } /
    cast:SizeCast _ value:Number { return { tag: "Cast", size: cast, value: value }; }

AddressDereferenceExpression =
	"[" _ label:LabelExpression _ index:IndexExpression? _ "]" { return { tag: "Label", value: label.value, deref: true, index: index }; } /
    "[" _ number:Number _ index:IndexExpression? _ "]" { return { tag: "Number", value: number.value, deref: true, index: index }; }

LabelExpression =
	local:(".")? target:Identifier { return { tag: "Label", value: local !== null ? ("." + target.value) : target.value }; }

RegisterDereferenceExpression =
	"[" _ baseReg:Register _ index:IndexExpression? _ "]"
    {
    	return {
    		tag: "Mem",
        	baseRegister: baseReg,
        	index: index
    	};
    }

IndexExpression =
	 index:("+" _ register:Register _ "*" _ multiplier:Number
        	{ return { register: register, multiplier: multiplier.value } })?
        _
        constant: (operator:$("+" / "-") _ constant:Number
                    {
                    	if (operator === "-")
                    	{
                    		constant.value *= -1;
                    	}
                    	return constant;
                    } )?
    { return { index: index, constant: constant }; }

Register =
	(
    	"EAX"i / "EBX"i / "ECX"i / "EDX"i / "EBP"i / "ESP"i / "EDI"i / "ESI"i
    ) { return { tag: "Reg", name: text(), size: 4 }; } /
    (
    	"AX"i / "BX"i / "CX"i / "DX"i
    ) { return { tag: "Reg", name: text(), size: 2 } } /
    (
    	"AH"i / "BH"i / "CH"i / "DH"i / "AL"i / "BL"i / "CL"i / "DL"i
    ) { return { tag: "Reg", name: text(), size: 1 } }

SizeCast =
	"BYTE"i { return 1; } /
    "WORD"i { return 2; } /
    "DWORD"i { return 4; } /
    "" { return 0; }

Identifier =
	[a-zA-Z_][a-zA-Z_0-9]* { return { tag: "Identifier", value: text() }; }

Number =
	"0x"[0-9a-fA-F]+ { return { tag: "Number", value: parseInt(text(), 16), size: 4 }; } /
	[0-9]+ { return { tag: "Number", value: parseInt(text(), 10), size: 4 }; }

String =
	"'" value:("\\'" { return "'"; } / [^'])* "'" { return { tag: "String", value: value }; }

_ "whitespace"
  = [ \t\r]*

__ "whitespace_plus_lines"
  = [ \t\r\n]*
