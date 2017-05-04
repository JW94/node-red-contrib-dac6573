module.exports = function(RED) {
    var dac6573 = require('dac6573');
    
    function initDAC6573(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        this.status({fill:"orange",shape:"ring",text:"Not Initialised"});
        this.on('input', function(msg) {
            this.dac = new dac6573('/dev/i2c-2', 0x4C);
            globalContext.set("i2cDac",this.dac);
            globalContext.set("initDac",true);
            if(globalContext.initDac)
            {
                this.status({fill:"green",shape:"dot",text:"Initialised"});
            }
            else
            {
                
                this.status({fill:"red",shape:"ring",text:"Not Initialised"});
            }
            node.send(null);
        });
    }
    RED.nodes.registerType("dac6573init",initDAC6573);
    
    function getVoltLtc2309(config) {
        RED.nodes.createNode(this,config);
        this.channel = config.channel;
        var node = this;
        var globalContext = this.context().global;
        this.on('input', function(msg) 
        {
            if(globalContext.initDac)
            {                
                this.status({fill:"green",shape:"dot",text:"?"});
                globalContext.i2cDac.setDACVoltage(this.channel,parseFloat(msg.payload),function(err)
                {
                    node.warn(err);
                });
            }
            else
            {
                node.warn("I2C nicht initialisiert");
                msg=null;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("dac6573setVoltCh",getVoltLtc2309);
}