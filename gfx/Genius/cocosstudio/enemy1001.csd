<GameProjectFile>
  <PropertyGroup Type="Node" Name="enemy1001" ID="8a44bfe0-4d43-4e78-844c-c385c62cec55" Version="2.3.2.3" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="72" Speed="0.5000">
        <Timeline ActionTag="2065617120" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_stand01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_stand02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_stand03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_stand04.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="1234471893" Property="FileData">
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="13" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="16" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="19" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit04.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="22" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit05.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="25" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit06.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="28" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_hit07.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="1449631893" Property="FileData">
          <TextureFrame FrameIndex="29" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_die01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="32" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_die02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="35" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_die03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="38" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_die04.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="41" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_die05.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-1510959012" Property="FileData">
          <TextureFrame FrameIndex="42" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="45" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="48" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk04.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="51" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk05.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="54" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk06.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="57" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk07.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="60" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk08.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="63" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk09.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="66" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk10.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="69" Tween="False">
            <TextureFile Type="Normal" Path="enemy/enemy1001/enemy1001_atk11.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="72" Tween="False">
            <TextureFile Type="Default" Path="" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <ObjectData Name="enemy1001" Tag="18" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="stand" ActionTag="2065617120" Tag="22" IconVisible="False" LeftMargin="-69.4980" RightMargin="-69.5020" TopMargin="-163.0000" ctype="SpriteObjectData">
            <Size X="139.0000" Y="163.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position X="0.0020" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="enemy/enemy1001/enemy1001_stand04.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="hit" ActionTag="1234471893" Tag="21" IconVisible="False" LeftMargin="-68.9931" RightMargin="-69.0069" TopMargin="-162.0693" BottomMargin="0.0693" ctype="SpriteObjectData">
            <Size X="138.0000" Y="162.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position X="0.0069" Y="0.0693" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="enemy/enemy1001/enemy1001_hit07.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="die" ActionTag="1449631893" Tag="20" IconVisible="False" LeftMargin="-68.7910" RightMargin="-69.2090" TopMargin="-162.0001" BottomMargin="0.0001" ctype="SpriteObjectData">
            <Size X="148.0000" Y="96.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position X="0.2090" Y="0.0001" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="enemy/enemy1001/enemy1001_die04.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="atk" ActionTag="-1510959012" Tag="19" IconVisible="False" LeftMargin="-68.8352" RightMargin="-69.1648" TopMargin="-162.0001" BottomMargin="0.0001" ctype="SpriteObjectData">
            <Size X="138.0000" Y="162.0000" />
            <AnchorPoint ScaleX="0.4918" />
            <Position X="-0.9711" Y="0.0001" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="enemy/enemy1001/enemy1001_atk01.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameProjectFile>