#pragma once

struct VB_ERRORS
{
	HRESULT Error;
	CString Source;
	CString Description;
};

// currently supported dictionaries
const VB_ERRORS vberrs[] = { 
	{0x800A03E9, L"Microsoft VBScript syntax error",  L"Memory error"},
	{0x800A03EA, L"Microsoft VBScript syntax error",  L"Syntax error"},
	{0x800A03EB, L"Microsoft VBScript syntax error",  L"Lack of ':'"},
	{0x800A03ED, L"Microsoft VBScript syntax error",  L"Lack of '('"},
	{0x800A03EE, L"Microsoft VBScript syntax error",  L"Lack of ')'"},
	{0x800A03EF, L"Microsoft VBScript syntax error",  L"Lack of ']'"},
	{0x800A03F2, L"Microsoft VBScript syntax error",  L"The lack of identifiers"},
	{0x800A03F3, L"Microsoft VBScript syntax error",  L"Lack of '='"},
	{0x800A03F4, L"Microsoft VBScript syntax error",  L"Lack of 'If'"},
	{0x800A03F5, L"Microsoft VBScript syntax error",  L"Lack of 'To'"},
	{0x800A03F6, L"Microsoft VBScript syntax error",  L"Lack of 'End'"},
	{0x800A03F7, L"Microsoft VBScript syntax error",  L"Lack of 'Function'"},
	{0x800A03F8, L"Microsoft VBScript syntax error",  L"Lack of 'Sub'"},
	{0x800A03F9, L"Microsoft VBScript syntax error",  L"Lack of 'Then'"},
	{0x800A03FA, L"Microsoft VBScript syntax error",  L"Lack of 'Wend'"},
	{0x800A03FB, L"Microsoft VBScript syntax error",  L"Lack of 'Loop'"},
	{0x800A03FC, L"Microsoft VBScript syntax error",  L"Lack of 'Next'"},
	{0x800A03FD, L"Microsoft VBScript syntax error",  L"Lack of 'Case'"},
	{0x800A03FE, L"Microsoft VBScript syntax error",  L"Lack of 'Select'"},
	{0x800A03FF, L"Microsoft VBScript syntax error",  L"The lack of expression"},
	{0x800A0400, L"Microsoft VBScript syntax error",  L"The lack of statement"},
	{0x800A0401, L"Microsoft VBScript syntax error",  L"Statement is not the end of"},
	{0x800A0402, L"Microsoft VBScript syntax error",  L"The lack of integer constants"},
	{0x800A0403, L"Microsoft VBScript syntax error",  L"Lack of 'While ' or 'Until'"},
	{0x800A0404, L"Microsoft VBScript syntax error",  L"Lack of 'While ', 'Until' or end of statement is not"},
	{0x800A0405, L"Microsoft VBScript syntax error",  L"Lack of 'With'"},
	{0x800A0406, L"Microsoft VBScript syntax error",  L"Identifier is too long"},
	{0x800A0407, L"Microsoft VBScript syntax error",  L"Invalid digital"},
	{0x800A0408, L"Microsoft VBScript syntax error",  L"Invalid character"},
	{0x800A0409, L"Microsoft VBScript syntax error",  L"Not the end of the string constant"},
	{0x800A040A, L"Microsoft VBScript syntax error",  L"Notes is not the end of"},
	{0x800A040D, L"Microsoft VBScript syntax error",  L"Invalid use of 'Me' keyword"},
	{0x800A040E, L"Microsoft VBScript syntax error",  L"'Loop' statement the lack of 'do'"},
	{0x800A040F, L"Microsoft VBScript syntax error",  L"Invalid 'exit' statement"},
	{0x800A0410, L"Microsoft VBScript syntax error",  L"Cycle control variable 'for' null and void"},
	{0x800A0411, L"Microsoft VBScript syntax error",  L"The name of re-definition of"},
	{0x800A0412, L"Microsoft VBScript syntax error",  L"Must be the first in a line statement"},
	{0x800A0413, L"Microsoft VBScript syntax error",  L"Can not assign non-ByVal parameters"},
	{0x800A0414, L"Microsoft VBScript syntax error",  L"Call the subro utine can not use brackets when"},
	{0x800A0415, L"Microsoft VBScript syntax error",  L"The lack of te xt constants"},
	{0x800A0416, L"Microsoft VBScript syntax error",  L"Lack of 'In'"},
	{0x800A0417, L"Microsoft VBScript syntax error",  L"Lack of 'Class'"},
	{0x800A0418, L"Microsoft VBScript syntax error",  L"Must be within the definition of a class"},
	{0x800A0419, L"Microsoft VBScript syntax error",  L"In the attribu te the lack of a statement Let, Set or Get"},
	{0x800A041A, L"Microsoft VBScript syntax error",  L"Lack of 'Property'"},
	{0x800A041B, L"Microsoft VBScript syntax error",  L"All of the properties in the specification, the number of variables must be consistent"},
	{0x800A041C, L"Microsoft VBScript syntax error",  L"In a category does not allow a number of default attributes / methods"},
	{0x800A041D, L"Microsoft VBScript syntax error",  L"Class did not initialize or terminate the process parameters"},
	{0x800A041E, L"Microsoft VBScript syntax error",  L"Attribute set or let must have at least one parameter"},
	{0x800A041F, L"Microsoft VBScript syntax error",  L"Error 'Next'"},
	{0x800A0420, L"Microsoft VBScript syntax error",  L"Default 'can only be in the 'Property', 'Function' or 'Sub' in the designated"},
	{0x800A0421, L"Microsoft VBScript syntax error",  L"Specify 'Default' must be specified when the 'Public'"},
	{0x800A0422, L"Microsoft VBScript syntax error",  L"Can only specify the Property Get in the 'Default'"},
	{0x800A0005, L"Microsoft VBScript runtime error", L"Invalid procedure call or parameter"},
	{0x800A0006, L"Microsoft VBScript runtime error", L"Overflow error"},
	{0x800A0007, L"Microsoft VBScript runtime error", L"Memory error"},
	{0x800A0009, L"Microsoft VBScript runtime error", L"Subscript cross-border"},
	{0x800A000A, L"Microsoft VBScript runtime error", L"The array as a fixed-length or temporary locked"},
	{0x800A000B, L"Microsoft VBScript runtime error", L"Division by zero"},
	{0x800A000D, L"Microsoft VBScript runtime error", L"Type does not match"},
	{0x800A000E, L"Microsoft VBScript runtime error", L"String have not enough space"},
	{0x800A0011, L"Microsoft VBScript runtime error", L"Unable to perform the required operation"},
	{0x800A001C, L"Microsoft VBScript runtime error", L"Stack overflow"},
	{0x800A0023, L"Microsoft VBScript runtime error", L"Undefined procedure or function"},
	{0x800A0030, L"Microsoft VBScript runtime error", L"Load DLL Error"},
	{0x800A0033, L"Microsoft VBScript runtime error", L"Internal Error"},
	{0x800A0034, L"Microsoft VBScript runtime error", L"Wrong file name or number"},
	{0x800A0035, L"Microsoft VBScript runtime error", L"File Not Found"},
	{0x800A0036, L"Microsoft VBScript runtime error", L"Wrong file mode"},
	{0x800A0037, L"Microsoft VBScript runtime error", L"Document has been opened"},
	{0x800A0039, L"Microsoft VBScript runtime error", L"Device I/O error"},
	{0x800A003A, L"Microsoft VBScript runtime error", L"File already exists"},
	{0x800A003D, L"Microsoft VBScript runtime error", L"Disk full"},
	{0x800A003E, L"Microsoft VBScript runtime error", L"Input file beyond the end of"},
	{0x800A0043, L"Microsoft VBScript runtime error", L"Too many files"},
	{0x800A0044, L"Microsoft VBScript runtime error", L"Device not available"},
	{0x800A0046, L"Microsoft VBScript runtime error", L"Do not have permission to"},
	{0x800A0047, L"Microsoft VBScript runtime error", L"Disk not ready"},
	{0x800A004A, L"Microsoft VBScript runtime error", L"Can not rename a symbol of other drive"},
	{0x800A004B, L"Microsoft VBScript runtime error", L"Path/file access error"},
	{0x800A004C, L"Microsoft VBScript runtime error", L"Path not found"},
	{0x800A005B, L"Microsoft VBScript runtime error", L"Object variable not set"},
	{0x800A005C, L"Microsoft VBScript runtime error", L"For cycle unini tialized"},
	{0x800A005E, L"Microsoft VBScript runtime error", L"Invalid use of Null"},
	{0x800A0142, L"Microsoft VBScript runtime error", L"Can not create necessary temporary file"},
	{0x800A01A8, L"Microsoft VBScript runtime error", L"The lack of target"},
	{0x800A01AD, L"Microsoft VBScript runtime error", L"ActiveX component can not create object"},
	{0x800A01AE, L"Microsoft VBScript runtime error", L"Type of operation can not support Automation"},
	{0x800A01B0, L"Microsoft VBScript runtime error", L"Automation oper ations in the file name or class name not found"},
	{0x800A01B6, L"Microsoft VBScript runtime error", L"The object does not support this property or method"},
	{0x800A01B8, L"Microsoft VBScript runtime error", L"Automation error"},
	{0x800A01BD, L"Microsoft VBScript runtime error", L"The object does not support this operation"},
	{0x800A01BE, L"Microsoft VBScript runtime error", L"The object does not support named parameters"},
	{0x800A01BF, L"Microsoft VBScript runtime error", L"The object does not support the current regional settings"},
	{0x800A01C0, L"Microsoft VBScript runtime error", L"Not found has been named parameters"},
	{0x800A01C1, L"Microsoft VBScript runtime error", L"Parameters are certainly options"},
	{0x800A01C2, L"Microsoft VBScript runtime error", L"Wrong number of parameters or invalid attribute value of the parameter"},
	{0x800A01C3, L"Microsoft VBScript runtime error", L"Object is not a collection of"},
	{0x800A01C5, L"Microsoft VBScript runtime error", L"Did not find the specified DLL function"},
	{0x800A01C7, L"Microsoft VBScript runtime error", L"Code resource lock error"},
	{0x800A01CA, L"Microsoft VBScript runtime error", L"Use a variable in VBScript does not support the type of Automation"},
	{0x800A01CE, L"Microsoft VBScript runtime error", L"Remote server does not exist or is not available"},
	{0x800A01E1, L"Microsoft VBScript runtime error", L"Invalid image"},
	{0x800A01F4, L"Microsoft VBScript runtime error", L"Variable not defined"},
	{0x800A01F5, L"Microsoft VBScript runtime error", L"Illegal assignment"},
	{0x800A01F6, L"Microsoft VBScript runtime error", L"Object can not be safe for use Script Programming"},
	{0x800A01F7, L"Microsoft VBScript runtime error", L"Object can not be safe to initialize "},
	{0x800A01F8, L"Microsoft VBScript runtime error", L"Object can not create a secure environment"},
	{0x800A01F9, L"Microsoft VBScript runtime error", L"Invalid or non-qualified reference"},
	{0x800A01FA, L"Microsoft VBScript runtime error", L"Type is not defined"},
	{0x800A01FB, L"Microsoft VBScript runtime error", L"An unexpected error"},
	{0x800A1398, L"Microsoft VBScript runtime error", L"The lack of expression of conventional object"},
	{0x800A1399, L"Microsoft VBScript runtime error", L"Regular expression syntax error"},
	{0x800A139A, L"Microsoft VBScript runtime error", L"Unexpected quantifier in regular expression"},
	{0x800A139B, L"Microsoft VBScript runtime error", L"Regular expression is missing ']'"},
	{0x800A139C, L"Microsoft VBScript runtime error", L"Regular expression is missing ')'"},
	{0x800A139D, L"Microsoft VBScript runtime error", L"Character set cross-border"},
	{0x800A802B, L"Microsoft VBScript runtime error", L"Element not found"}
};
