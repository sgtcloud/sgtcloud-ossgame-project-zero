<GameProjectFile>
  <PropertyGroup Type="Node" Name="enemy1001" ID="983d1fb3-ded6-4734-bbad-e19c0197f01d" Version="2.3.2.3" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="45" Speed="0.5000">
        <Timeline ActionTag="-2095209528" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_stand1.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_stand2.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_stand3.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="1956013188" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit1.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit2.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit3.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit4.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="20" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit5.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="25" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit6.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="30" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_hit7.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-323409268" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_die1.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_die2.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_die3.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_die4.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="1774876014" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk1.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk10.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk2.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="15" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk3.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="20" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk4.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="25" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk5.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="30" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk6.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="35" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk7.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="40" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk8.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="45" Tween="False">
            <TextureFile Type="Normal" Path="hero/enemy1001_atk9.png" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <ObjectData Name="enemy1001" Tag="50" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="stand" ActionTag="-2095209528" Tag="53" IconVisible="False" LeftMargin="-71.0000" RightMargin="25.0000" TopMargin="-66.0000" BottomMargin="20.0000" ctype="SpriteObjectData">
            <Size X="167.0000" Y="157.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="-48.0000" Y="43.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hero/enemy1001_stand3.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="hit" ActionTag="1956013188" Tag="54" IconVisible="False" LeftMargin="-307.5000" RightMargin="150.5000" TopMargin="-139.5000" BottomMargin="-3.5000" ctype="SpriteObjectData">
            <Size X="157.0000" Y="143.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="-229.0000" Y="68.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hero/enemy1001_hit7.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="die" ActionTag="-323409268" Tag="55" IconVisible="False" LeftMargin="306.0000" RightMargin="-462.0000" TopMargin="-105.5000" BottomMargin="4.5000" ctype="SpriteObjectData">
            <Size X="156.0000" Y="101.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="384.0000" Y="55.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hero/enemy1001_die4.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="atk" ActionTag="1774876014" Tag="56" IconVisible="False" LeftMargin="61.0000" RightMargin="-269.0000" TopMargin="-132.5000" BottomMargin="-16.5000" ctype="SpriteObjectData">
            <Size X="208.0000" Y="149.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="165.0000" Y="58.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hero/enemy1001_atk6.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameProjectFile>